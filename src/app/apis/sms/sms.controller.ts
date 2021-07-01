/*
 * Copyright [2020] Universitätsmedizin Mainz, Gutenberg Health Hub
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AddressType, GeocodingAddressComponentType } from '@googlemaps/google-maps-services-js';
import {
    IncomingSMS,
    IncomingSMSProcessingListEntryResult,
    IncomingSMSProcessingListEntry,
    Emergency,
    EmergencyEnum,
} from 'app/data/models';
import { ControlCenterService } from 'app/data/modelservices';
import { ServiceManager, GoogleMapsService } from 'app/data/services';

export class SMSController {
    private controlCenterService = ServiceManager.get(ControlCenterService);
    private googleMapsService = ServiceManager.get(GoogleMapsService);

    public consumeIncomingSMS(
        apiProvider: string,
        apiProviderTime: Date,
        senderAddress: string,
        receiverAddress: string,
        content: string,
    ) {
        return new Promise<void>((resolve, reject) => {
            const incomingSMS = new IncomingSMS();
            incomingSMS.apiProvider = apiProvider;
            incomingSMS.apiProviderTime = apiProviderTime;
            incomingSMS.senderAddress = senderAddress;
            incomingSMS.receiverAddress = receiverAddress;
            incomingSMS.content = content;
            incomingSMS.save().then(
                (sms) => {
                    console.log('saved SMS');
                    console.log(incomingSMS);
                    enum AvailableProcessingMethodNames {
                        createEmergencyBySMS = 'createEmergencyBySMS',
                    }

                    const availableProcessingMethods = new Map<
                        AvailableProcessingMethodNames,
                        (incomingSMS: IncomingSMS) => Promise<IncomingSMSProcessingListEntryResult>
                    >();
                    availableProcessingMethods.set(
                        AvailableProcessingMethodNames.createEmergencyBySMS,
                        this.createEmergencyBySMS,
                    );

                    const selectedProcessingMethods = new Array<AvailableProcessingMethodNames>();
                    switch (apiProvider) {
                        case 'i-digital-m':
                            {
                                selectedProcessingMethods.push(AvailableProcessingMethodNames.createEmergencyBySMS);
                            }
                            break;
                    }

                    if (selectedProcessingMethods.length == 0) {
                        resolve();
                    }

                    for (const selectedProcessingMethod of selectedProcessingMethods) {
                        const processingMethod = availableProcessingMethods.get(selectedProcessingMethod);
                        if (processingMethod) {
                            const processingListEntry = new IncomingSMSProcessingListEntry(selectedProcessingMethod);
                            const resultPromise = processingMethod.bind(this)(incomingSMS);
                            resultPromise.then((result) => {
                                processingListEntry.setResult(result);
                                sms.processingList.push(processingListEntry);
                                sms.save();
                                if (result.status !== 0) {
                                    reject('SMS with ID "' + sms.id + '" was not processed.');
                                    console.error(
                                        'Processing of incoming SMS with ID "' +
                                            sms.id +
                                            '" failed for method ' +
                                            selectedProcessingMethod +
                                            '. \r\nMessage: ' +
                                            result.message,
                                    );
                                } else {
                                    resolve();
                                }
                            });
                        }
                    }
                },
                (error) => {
                    console.log(error), reject(error);
                },
            );
        });
    }

    private createEmergencyBySMS(sms: IncomingSMS): Promise<IncomingSMSProcessingListEntryResult> {
        return new Promise<IncomingSMSProcessingListEntryResult>((resolvePromise) => {
            new Promise<Emergency>((FINISH, ERROR) => {
                const content = sms.content;
                const parts = content.split(';').map((value) => value.trim());

                if (parts.length !== 10) {
                    return ERROR('Too less/many fields in message! Expected 10, found ' + parts.length);
                }

                const controlCenterId = parts[0];
                const city = parts[1];
                const street = parts[2];
                const streetNumber = parts[3];
                const locationPointX = Number.parseFloat(parts[4].replace(',', '.'));
                const locationPointY = Number.parseFloat(parts[5].replace(',', '.'));
                const emergencyNumber = parts[6];
                const keyword = parts[7];
                const informationString = parts[8];
                const patientName = parts[9];
                const indicatorName = parts[10];

                if (!controlCenterId) {
                    return ERROR('controlCenterId missing');
                }

                if (!informationString) {
                    return ERROR('informationString missing');
                }

                const latLngGiven = locationPointX && locationPointY;
                const addressGiven = city && street && streetNumber;

                if (!latLngGiven && !addressGiven) {
                    return ERROR(
                        'Parts of (locationPointX and locationPointY) or (city and street and streetNumber) missing',
                    );
                }

                this.controlCenterService.getById(controlCenterId).then((controlCenter) => {
                    if (!controlCenter) {
                        return ERROR('ControlCenter with id "' + controlCenterId + '" does not exist');
                    }

                    if (!controlCenter.isTrustedSMSAPISender(sms.senderAddress)) {
                        return ERROR(
                            'The SMS sender "' +
                                sms.senderAddress +
                                '" is not part of the controlCenter\'s trust list: ' +
                                controlCenter.SMSAPItrustedSenders,
                        );
                    }

                    const geocoder = this.googleMapsService.getClient();
                    const emergency = new Emergency();
                    emergency.controlCenterRelation = controlCenter;
                    emergency.informationString = informationString;
                    emergency.keyword = keyword ? keyword : undefined;
                    emergency.patientName = patientName ? patientName : undefined;
                    emergency.indicatorName = indicatorName ? indicatorName : undefined;
                    emergency.emergencyNumberDC = emergencyNumber ? emergencyNumber : undefined;
                    emergency.state = EmergencyEnum.new;
                    if (addressGiven) {
                        emergency.city = city ? city : undefined;
                        emergency.streetName = street ? street : undefined;
                        emergency.streetNumber = streetNumber;
                    }
                    if (latLngGiven) {
                        emergency.setLocationPoint(locationPointX, locationPointY);

                        if (addressGiven) {
                            return FINISH(emergency);
                        } else {
                            geocoder
                                .reverseGeocode({
                                    params: {
                                        latlng: {
                                            latitude: locationPointX,
                                            longitude: locationPointY,
                                        },
                                        key: process.env.MAPS_API_KEY,
                                    },
                                })
                                .then((response) => {
                                    const results = response.data.results;
                                    if (results.length >= 1) {
                                        for (const addressComponent of results[0].address_components) {
                                            for (const type in addressComponent.types) {
                                                switch (type) {
                                                    case AddressType.locality:
                                                        emergency.city = addressComponent.long_name;
                                                        break;
                                                    case AddressType.postal_code:
                                                        emergency.zip = addressComponent.long_name;
                                                        break;
                                                    case AddressType.route:
                                                        emergency.streetName = addressComponent.long_name;
                                                        break;
                                                    case GeocodingAddressComponentType.street_number:
                                                        emergency.streetNumber = addressComponent.long_name;
                                                        break;
                                                    case AddressType.country:
                                                        emergency.country = addressComponent.long_name;
                                                        break;
                                                }
                                            }
                                        }
                                    }
                                    return FINISH(emergency);
                                });
                        }
                    } else {
                        const address =
                            emergency.streetName +
                            ' ' +
                            emergency.streetNumber +
                            ', ' +
                            emergency.zip +
                            ' ' +
                            emergency.city;
                        geocoder
                            .geocode({
                                params: {
                                    key: process.env.MAPS_API_KEY,
                                    address: address,
                                    components: { country: 'DE' },
                                },
                            })
                            .then((response) => {
                                const results = response.data.results;
                                if (results.length >= 1) {
                                    emergency.setLocationPoint(
                                        results[0].geometry.location.lat,
                                        results[0].geometry.location.lng,
                                    );
                                    return FINISH(emergency);
                                } else {
                                    return ERROR('Could not determine LatLng for address: ' + address);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                });
            })
                .then((emergency) => {
                    emergency.save().then(
                        () => {
                            resolvePromise(IncomingSMSProcessingListEntryResult.ok());
                        },
                        (reason) => resolvePromise(IncomingSMSProcessingListEntryResult.error(reason)),
                    );
                })
                .catch((reason) => {
                    resolvePromise(IncomingSMSProcessingListEntryResult.error(reason));
                });
        });
    }
}
