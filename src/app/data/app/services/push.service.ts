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

import { Configuration, EmergencyState, Installation } from 'app/data/models';
import { ConfigurationService } from 'app/data/common/modelservices';
import { ServiceManager } from './service-manager';
import { Localization } from '../../common/models/localization';

// Class for sending push notification with emergency IDs to nearest firstresponders
export class PushService {
    private configurationService = ServiceManager.get(ConfigurationService);

    public sendEmergencyPush(pushQuery: Parse.Query<Installation>, installation: Installation, sound: string, configuration: Configuration, emergencyState: EmergencyState, badge: number | string, silent: boolean) {
        return new Promise((resolve, reject) => {

            const localization = new Localization(installation.localeIdentifier);
            const alert = localization.alert();

            // default sound if non is defined
            if (!sound || sound === '') {
                sound = 'horn.wav';
            }

            // send control center configuration parameters
            if (!configuration) {
                configuration = this.configurationService.getDefault(emergencyState.controlCenterRelation);
            }

            //     New Emergency configuration
            //
            //     1x
            //     alert: {loc-key: "EMERGENCY_NEARBY"}
            //
            //     10x
            //     without alert
            //
            //
            //     if emergency state == 0 then
            //     content-available: "1"
            //     alert: {loc-key: "EMERGENCY_NEARBY"}
            // else
            //     content-available: null
            //     alert: null
            //
            //
            //     Emergency cancel
            //     alert: {loc-key: "EMERGENCY_CANCELLED"}
            //     content-available: "1"

            // DO NOT SEND detailed emergency information to users ONLY IDs.
            // The emergency information is retrieved by the App after the user has accepted the emergency.
            Parse.Push.send({
                where: pushQuery,
                data: {
                    aps: {
                        'content-available': '1', // Optional
                        'sound': {
                            'critical': 1,
                            'name': sound
                        }
                    },
                    'alert': alert,
                    'emergencyStateId': emergencyState.id,
                    'emergencyId': emergencyState.emergencyRelation.id,
                    'badge': badge,
                    'createdAt': emergencyState.createdAt,
                    'config': {
                        'id': configuration.id, // possibly null
                        'distance': configuration.distance,
                        'emergencyTask': emergencyState.emergencyTask
                    }
                }
            }, {
                    useMasterKey: true,
                    success: () => resolve(),
                    error: (error) => reject(error)
                }
            );
        });
    }
}
