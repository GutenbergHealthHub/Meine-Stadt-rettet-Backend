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

import { EmergencyStateEnum, LocationTracking } from 'app/data/models';
import { ServiceManager, GoogleMapsService } from 'app/data/services';
import { EmergencyStateService, LocationTrackingService } from 'app/data/modelservices';
import { TriggerHandler } from './base/trigger-handler';

// Location tracking trigger calculates the current distance of the firstresponder to the emergency location.
class LocationTrackingTriggerHandler extends TriggerHandler<LocationTracking, LocationTrackingService> {
    private emergencyStateService = ServiceManager.get(EmergencyStateService);
    private googleMapsService = ServiceManager.get(GoogleMapsService);

    constructor() {
        super(LocationTracking, LocationTrackingService);
    }

    // Trigger after current user location is inserted.
    protected afterCreate(locationTracking: LocationTracking) {
        this.emergencyStateService
            .getById(locationTracking.emergencyStateRelation.id, ['emergencyRelation'])
            .then((emergencyState) => {
                locationTracking.emergencyRelation = emergencyState.emergencyRelation;
                locationTracking.userRelation = emergencyState.userRelation;
                locationTracking.save().then(
                    (ret) => {
                        console.log('success: ' + ret);
                    },
                    (error) => {
                        console.warn('LocationTracking error: ' + error);
                    },
                );

                // Save distance and duration with google maps service.
                this.googleMapsService.getClient().distanceMatrix(
                    {
                        origins: [locationTracking.location.latitude + ', ' + locationTracking.location.longitude],
                        destinations: [
                            emergencyState.emergencyRelation.locationPoint.latitude +
                                ', ' +
                                emergencyState.emergencyRelation.locationPoint.longitude,
                        ],
                        mode: 'walking',
                    },
                    (error, response) => {
                        if (error == null) {
                            const results = response.json.rows[0].elements;
                            const element = results[0];

                            locationTracking.duration = element.duration.value / 60;
                            locationTracking.distance = element.distance.value;
                            locationTracking.save();

                            if (locationTracking.distance <= 20) {
                                emergencyState.state = EmergencyStateEnum.arrived;
                                emergencyState.save();
                            }
                        } else {
                            console.warn('LocationTracking error while getting distance from MAPS API');
                            console.warn(error);
                        }
                    },
                );
            });
    }
}

TriggerHandler.register(LocationTrackingTriggerHandler);
