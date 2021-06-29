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
 * 
 * 
 */

import { GoogleMapsService } from './google-maps.service';
import { ServiceManager } from './service-manager';
import { Emergency } from 'app/data/models';

export class EmergencyUtilService {

    private googleMapsService = ServiceManager.get(GoogleMapsService);

    public setLocationByAddress(emergency: Emergency): Promise<Emergency> {
        return new Promise<Emergency>((resolve, reject) => {
            this.googleMapsService.getClient().geocode({ address: emergency.streetName + ' ' + emergency.streetNumber + ', ' + emergency.city }, (error, response) => {
                if (error == null) {
                    const geometry = response.json.results[0].geometry;
                    emergency.locationPoint = new Parse.GeoPoint({ latitude: geometry.location.lat, longitude: geometry.location.lng });
                    emergency.save().then((emergency) => {
                        console.log('geolocation save success');
                        resolve(emergency);
                    }, (error) => {
                        console.log('geolocation save error');
                        reject(error.message);
                    });
                } else {
                    console.warn(error);
                    reject(error);
                }
            });
        });
    }

    public setAddressByLocation(emergency: Emergency): Promise<Emergency> {
        return new Promise<Emergency>((resolve, reject) => {
            try {
                this.googleMapsService.getClient().reverseGeocode({ latlng: [emergency.locationPoint.latitude, emergency.locationPoint.longitude] }, (error, response) => {
                    if (error == null) {
                        const components = response.json.results[0].address_components;
                        for (const component of components) {
                            const type = component.types[0];
                            switch (type) {
                                case 'route': {
                                    emergency.streetName = !emergency.streetName ? component.long_name : emergency.streetName;
                                } break;
                                case 'street_number': {
                                    emergency.streetNumber = !emergency.streetNumber ? component.long_name : emergency.streetNumber;
                                } break;
                                case 'locality': {
                                    emergency.city = !emergency.city ? component.long_name : emergency.city;
                                } break;
                                case 'postal_code': {
                                    emergency.zip = !emergency.zip ? component.long_name : emergency.zip;
                                } break;
                                case 'country': {
                                    emergency.country = !emergency.country ? component.long_name : emergency.country;
                                } break;
                            }
                        }
                        // save Emergency
                        emergency.save().then(() => {
                            console.log('address save success');
                            resolve(emergency);
                        }, (error) => {
                            console.log('address save error');
                            reject(error.message);
                        });
                    } else {
                        console.warn(error);
                        reject(error);
                    }
                });
            } catch (e) {
                console.warn(e);
                reject(e);
            }
        });
    }
}
