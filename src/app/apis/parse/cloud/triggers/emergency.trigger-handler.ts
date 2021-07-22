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

import {
    Configuration,
    Emergency,
    EmergencyState,
    EmergencyStateEnum,
    EmergencyTaskEnum,
    Installation,
    InstallationDeviceEnum,
} from '../../../../data/models';
import { EmergencyUtilService, PushService, ServiceManager } from '../../../../data/services';
import {
    ConfigurationService,
    ControlCenterService,
    EmergencyService,
    EmergencyStateService,
    InstallationService,
    UserService,
} from '../../../../data/modelservices';
import { TriggerHandler } from './base/trigger-handler';

// Main class for sending emergency to nearest firstresponders.
class EmergencyTriggerHandler extends TriggerHandler<Emergency, EmergencyService> {
    private configurationService = ServiceManager.get(ConfigurationService);
    private controlCenterService = ServiceManager.get(ControlCenterService);
    private emergencyStateService = ServiceManager.get(EmergencyStateService);
    private installationService = ServiceManager.get(InstallationService);
    private userService = ServiceManager.get(UserService);

    private emergencyUtilService = ServiceManager.get(EmergencyUtilService);
    private pushService = ServiceManager.get(PushService);

    constructor() {
        super(Emergency, EmergencyService);
    }

    protected async afterCreate(emergency: Emergency) {
        try {
            // only if a valid controlcenter ID is provided the emergency is sent to the firstresponders.
            if (emergency.controlCenterRelation) {
                const controlCenter = await this.controlCenterService.getById(emergency.controlCenterRelation.id);
                if (!controlCenter) {
                    throw new Error('ControlCenter ' + emergency.controlCenterRelation.id + ' was not found');
                }

                // complete all location fields if any are missing
                emergency = await this.completeLocationIfRequired(emergency);
                // get configuration for the particular control center that wants to notify firstresponders
                const configuration = await this.configurationService.getByEmergency(emergency);
                emergency.configurationRelation = configuration;
                const receivers = await new Promise<Set<Installation>>((resolve, reject) => {
                    // if testEmergencySendBy field is provided then send emergency ONLY to this user. Useful for sending test emergencies.
                    // otherwise get all firstresponders who are within the configured radius.
                    if (emergency.testEmergencySendBy) {
                        this.installationService.getLatestOfUser(emergency.testEmergencySendBy).then((installation) => {
                            resolve(new Set<Installation>().add(installation));
                        });
                    } else {
                        this.installationService
                            .getAllInRangeByConfig(emergency.locationPoint, configuration)
                            .then((installations) => {
                                resolve(new Set<Installation>(installations));
                            });
                    }
                });
                console.log('Emergency Receivers of Emergency:' + emergency.id);
                if (receivers != null) {
                    console.log(
                        Array.from(receivers).map(
                            (installation) =>
                                installation.id +
                                ' ' +
                                installation.deviceType +
                                ' ' +
                                installation.userRelation.username,
                        ),
                    );
                } else {
                    console.log('No receivers for emergency found');
                }

                const lastInstallationInfo = { deviceType: null, userId: null };
                // filter all firstresponders who do not want to get notified based on their off duty configuration.
                const filteredReceivers = Array.from(receivers).filter((installation) => {
                    let result =
                        lastInstallationInfo.deviceType != installation.deviceType ||
                        installation.userRelation.id != lastInstallationInfo.userId;
                    // duty time calculation
                    if (installation.userRelation.dutyFrom && installation.userRelation.dutyTo) {
                        const dutyFrom =
                            installation.userRelation.dutyFrom.getUTCHours() * 60 +
                            installation.userRelation.dutyFrom.getUTCMinutes();
                        console.log('dutyFrom:', dutyFrom);
                        const dutyTo =
                            installation.userRelation.dutyTo.getUTCHours() * 60 +
                            installation.userRelation.dutyTo.getUTCMinutes();
                        const d = new Date().getUTCHours() * 60 + new Date().getUTCMinutes();
                        console.log('currentDate:', d);
                        result =
                            result &&
                            (dutyFrom <= dutyTo
                                ? (dutyFrom < d && dutyTo < d) || (dutyFrom > d && dutyTo > d)
                                : dutyFrom > d && dutyTo < d);
                    }
                    lastInstallationInfo.userId = installation.userRelation.id;
                    lastInstallationInfo.deviceType = installation.deviceType;
                    return result;
                });

                console.log('Filtered Emergency Receivers of Emergency:' + emergency.id);
                console.log(
                    filteredReceivers.map(
                        (installation) =>
                            installation.id + ' ' + installation.deviceType + ' ' + installation.userRelation.username,
                    ),
                );

                // default task is first aid
                if (!emergency.emergencyTask) {
                    emergency.emergencyTask = EmergencyTaskEnum.firstaid;
                }

                let isAEDFirstresponder: Installation = null;
                if (
                    emergency.emergencyTask == EmergencyTaskEnum.firstaid &&
                    configuration.isAEDFirstresponder &&
                    filteredReceivers.length > 1
                ) {
                    // ToDO: calculate nearest firstresponder to AED
                    isAEDFirstresponder = this.calculateNearestFirstresponderToAED(filteredReceivers);
                }
                const createStatePromisses = new Array<Promise<EmergencyState>>();
                let aedFirstresponder: boolean;
                // iterate through all device installations and notify device owners (firstresponders)
                for (const installation of filteredReceivers) {
                    aedFirstresponder = false;
                    const emergencyState = new EmergencyState();
                    emergencyState.emergencyRelation = emergency;
                    emergencyState.installationRelation = installation;
                    emergencyState.userRelation = installation.userRelation;
                    emergencyState.state = EmergencyStateEnum.initial;
                    emergencyState.maxRadius = configuration.distance;
                    emergencyState.emergencyTask = emergency.emergencyTask;
                    emergencyState.controlCenterRelation = emergency.controlCenterRelation;
                    if (isAEDFirstresponder && isAEDFirstresponder.id == installation.id) {
                        aedFirstresponder = true;
                        emergencyState.emergencyTask = EmergencyTaskEnum.getaed;
                    }
                    // save emergencyState record for every notified firstresponder
                    const promise = emergencyState.save();
                    // if creation of emergencyState record was successfull then send push notification.
                    promise.then(
                        (emergencyStateItem) => {
                            const sound = installation.userRelation.sound;
                            const pushQuery = this.installationService
                                .createQuery()
                                .equalTo('objectId', installation.id);
                            console.log(
                                'Sending Initial Push to Installation ' +
                                    installation.id +
                                    ' ' +
                                    installation.deviceType +
                                    ' ' +
                                    installation.userRelation.username,
                            );
                            // finally, send push notification
                            this.pushService
                                .sendEmergencyPush(
                                    pushQuery,
                                    installation,
                                    sound,
                                    configuration,
                                    emergencyStateItem,
                                    'increment',
                                    false,
                                )
                                .then(() => {
                                    console.log(
                                        'Sent Initial Push to Installation ' +
                                            installation.id +
                                            ' ' +
                                            installation.deviceType +
                                            ' ' +
                                            installation.userRelation.username,
                                    );
                                })
                                .catch((error) => {
                                    throw error;
                                });
                            emergency.emergencyStateArray = emergency.emergencyStateArray || [];
                            if (emergency.emergencyStateArray.indexOf(emergencyStateItem.id) < 0) {
                                emergency.emergencyStateArray.push(emergencyStateItem.id);
                                emergency.save();
                            }
                        },
                        (error) => {
                            throw error;
                        },
                    );
                    createStatePromisses.push(promise);
                }

                await Promise.all(createStatePromisses);
                // renotify firstresponders. This is a workaround especially for iOS devices, as automated repeated notifications is not working in iOS.
                this.reNotifyUsersInInterval(emergency, configuration);
            } else {
                throw new Error('error: missing controlCenter Relation');
            }
        } catch (error) {
            console.warn('Error afterCreate@emergency.trigger-handler: ' + (error as Error).message);
        }
    }

    private completeLocationIfRequired(emergency: Emergency): Promise<Emergency> {
        if (!emergency.locationPoint && (!emergency.streetName || !emergency.city)) {
            return Promise.reject('not enough data to complete location information');
        }
        return !emergency.locationPoint
            ? this.emergencyUtilService.setLocationByAddress(emergency)
            : this.emergencyUtilService.setAddressByLocation(emergency);
    }

    private calculateNearestFirstresponderToAED(filteredReceivers: Array<Installation>): Installation {
        return filteredReceivers[0];
        /*
        for (const installation of filteredReceivers) {
            get AED locations
            calculate nearest Firstresponder
            return firstresponder
        }
        */
    }

    private reNotifyUsersInInterval(emergency: Emergency, configuration: Configuration, i = 0) {
        new Promise((resolve, reject) => {
            setTimeout(() => {
                const promisses: Promise<Installation>[] = [];
                const emergencyStateQuery = this.emergencyStateService.createQuery();
                emergencyStateQuery.lessThan('state', 2);
                emergencyStateQuery.equalTo('emergencyRelation', emergency);
                emergencyStateQuery.find().then((emergencyStates) => {
                    for (const emergencyState of emergencyStates) {
                        const userQuery = this.userService
                            .createQuery()
                            .withinKilometers('location', emergency.locationPoint, configuration.distance / 1000);
                        const pushQuery = this.installationService
                            .createQuery()
                            .equalTo('objectId', emergencyState.installationRelation.id)
                            .equalTo('deviceType', InstallationDeviceEnum.ios)
                            .matchesQuery('userRelation', userQuery)
                            .include('userRelation');
                        const promise = pushQuery.first();
                        promisses.push(promise);
                        promise.then((installation) => {
                            if (installation) {
                                const sound = installation.userRelation.sound;
                                const pushQuery = this.installationService.createQuery();
                                pushQuery.equalTo('objectId', installation.id);
                                console.log(
                                    'Sending Interval Push to IOS Installation ' +
                                        installation.id +
                                        ' ' +
                                        installation.deviceType +
                                        ' ' +
                                        installation.userRelation.username,
                                );
                                this.pushService.sendEmergencyPush(
                                    pushQuery,
                                    installation,
                                    sound,
                                    configuration,
                                    emergencyState,
                                    null,
                                    true,
                                );
                            }
                        });
                    }
                });
                promisses[0].then();
                Promise.all(promisses).then((Installation) => {
                    resolve(0);
                });
            }, 7000);
        }).then(() => {
            if (i < 10) {
                this.reNotifyUsersInInterval(emergency, configuration, i + 1);
            }
        });
    }
}

TriggerHandler.register(EmergencyTriggerHandler);
