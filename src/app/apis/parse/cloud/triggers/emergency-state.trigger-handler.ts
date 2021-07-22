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

import { Emergency, EmergencyEnum, EmergencyState, EmergencyStateEnum } from '../../../../data/models';
import { Parse, ServiceManager } from '../../../../data/services';
import { EmergencyService, EmergencyStateService } from '../../../../data/modelservices';
import { TriggerHandler } from './base/trigger-handler';

// State change trigger for Emergency and EmergencyState classes. Trigger updates or creates timestamps for every state change.
// ##################
// EmergencyState "state" field
// ##################
// state 0 = emergency send out to potential firstresponder who are nearby the emergency
// state 1 = emergency received by firstresponder. App responds with state=1 in case of successfull network and GPS connection.
// state 2 = firstresponder recognized emergency. For instance by clicking on push notification or App is already open and displays the emergency.
// state 3 = emergency accepted by firstresponder
// state 4 = firstresponder arrived at the emergency location
// state 5 = emergency cancelled by firstresponder
// state 6 = emergency successfull
// state 7 = firstresponder was contacted for further information

// ##################
// Emergency "state" field
// ##################
// state 0 = new emergency received by control center
// state 3 = firstresponder(s) accepted emergency and are on the way to the emergency location
// state 4 = firstresponder(s) arrived at the emergency location. Timestamp is set if distance is < 10m.
// state 10 = all firstresponders cancelled emergency. No active firstresponder available.
// state 11 = emergency successfull finished
// state 12 = emergency cancelled by control center manually
// state 20 = emergency closed
// state 21 = emergency is post processed, i.e. all involved firstresponders were contacted after emergency.

class EmergencyStateTriggerHandler extends TriggerHandler<EmergencyState, EmergencyStateService> {
    private emergencyService = ServiceManager.get(EmergencyService);

    constructor() {
        super(EmergencyState, EmergencyStateService);
    }

    protected afterUpdate(emergencyState: EmergencyState) {
        this.emergencyService
            .getById(emergencyState.emergencyRelation.id, [Emergency.INCLUDABLES.configurationRelation])
            .then((emergency) => {
                // update date fields
                switch (emergencyState.state) {
                    // EmergencyState state = 2
                    case EmergencyStateEnum.ready:
                        {
                            if (!emergencyState.readyAt) {
                                emergencyState.readyAt = emergencyState.updatedAt;
                                emergencyState.save();
                            }
                        }
                        break;
                    // EmergencyState state = 3
                    case EmergencyStateEnum.accepted:
                        {
                            if (!emergencyState.acceptedAt) {
                                emergencyState.acceptedAt = emergencyState.updatedAt;
                                emergencyState.save();
                                emergency.firstresponderAccepted = true;
                                emergency.save();
                            }
                        }
                        break;
                    // EmergencyState state = 4
                    case EmergencyStateEnum.arrived:
                        {
                            if (!emergencyState.arrivedAt) {
                                emergencyState.arrivedAt = emergencyState.updatedAt;
                                emergencyState.save();
                            }
                        }
                        break;
                    // EmergencyState state = 5
                    case EmergencyStateEnum.aborted:
                        {
                            if (!emergencyState.cancelledAt) {
                                emergencyState.cancelledAt = emergencyState.updatedAt;
                                emergencyState.save();
                            }
                        }
                        break;
                    // EmergencyState state = 6
                    case EmergencyStateEnum.finished:
                        {
                            if (!emergencyState.endedAt) {
                                emergencyState.endedAt = emergencyState.updatedAt;
                                emergencyState.save();
                            }
                        }
                        break;
                    // EmergencyState state = 5, same as cancelled, but triggered by control center and not by firstresponder
                    case EmergencyStateEnum.calledBack:
                        {
                            if (!emergencyState.calledBackAt) {
                                emergencyState.calledBackAt = emergencyState.updatedAt;
                                emergencyState.save();
                            }
                        }
                        break;
                    // EmergencyState state = 7
                    case EmergencyStateEnum.contacted:
                        {
                            if (!emergencyState.contactedAt) {
                                emergencyState.contactedAt = emergencyState.contactedAt;
                                emergencyState.save();
                            }
                        }
                        break;
                }

                // Emergency state = 3
                // Emergency accepted by at least one firstresponder
                if (
                    (emergencyState.state == EmergencyStateEnum.accepted && emergency.state == EmergencyEnum.new) ||
                    (emergencyState.state == EmergencyStateEnum.accepted &&
                        emergency.state == EmergencyEnum.abortedByAllFirstresponders)
                ) {
                    emergency.state = emergencyState.state as number;
                    emergency.firstresponderAccepted = true as boolean;
                    emergency.save();
                }

                // Emergency state = 4
                if (emergencyState.state == EmergencyStateEnum.arrived && emergency.state < 10) {
                    emergency.state = emergencyState.state as number;
                    emergency.save();
                }

                // change to Emergency state = 10 if all firstresponders cancelled emergency
                if (
                    (emergencyState.state == EmergencyStateEnum.aborted ||
                        emergencyState.state == EmergencyStateEnum.calledBack) &&
                    emergency.state < 10
                ) {
                    const query1 = new Parse.Query(EmergencyState);
                    query1.equalTo('state', EmergencyStateEnum.accepted);
                    query1.equalTo('emergencyRelation', emergency);
                    const query2 = new Parse.Query(EmergencyState);
                    query2.equalTo('state', EmergencyStateEnum.arrived);
                    query2.equalTo('emergencyRelation', emergency);
                    const query3 = new Parse.Query(EmergencyState);
                    query3.equalTo('state', EmergencyStateEnum.finished);
                    query3.equalTo('emergencyRelation', emergency);

                    Parse.Query.or(query1, query2, query3)
                        .count()
                        .then((count) => {
                            if (count < 1) {
                                emergency.state = EmergencyEnum.abortedByAllFirstresponders;
                                emergency.save();
                            }
                        });
                }

                // Emergency state = 11
                if (
                    emergencyState.state == EmergencyStateEnum.finished &&
                    emergency.state < EmergencyEnum.successfullyFinished
                ) {
                    emergency.state = EmergencyEnum.successfullyFinished;
                    emergency.save();
                }

                // Emergency state = 21
                if (emergencyState.state == EmergencyStateEnum.contacted) {
                    const query = new Parse.Query(EmergencyState);
                    query.equalTo('emergencyRelation', emergency);
                    query.greaterThan('state', EmergencyStateEnum.ready);
                    query.lessThan('state', EmergencyStateEnum.contacted);
                    query.count().then((count) => {
                        if (count < 1) {
                            emergency.state = EmergencyEnum.doneAndPostProcessed;
                            emergency.save();
                        }
                    });
                }

                // check if the maximum of firstresponders is reached then abort emergency for all the others
                if (
                    emergency.configurationRelation.isRescuerCountLimited &&
                    emergency.configurationRelation.rescuerLimitation > 0 &&
                    emergencyState.state == EmergencyStateEnum.accepted
                ) {
                    const query = new Parse.Query(EmergencyState);
                    query.equalTo('emergencyRelation', emergency);
                    query.find().then((emergencyStates) => {
                        const acceptedStates = emergencyStates.filter(
                            (emergencyState) =>
                                emergencyState.state == EmergencyStateEnum.accepted ||
                                emergencyState.state == EmergencyStateEnum.arrived,
                        ).length;
                        console.log(acceptedStates);
                        if (acceptedStates >= emergency.configurationRelation.rescuerLimitation) {
                            for (emergencyState of emergencyStates.filter(
                                (emergencyState) =>
                                    emergencyState.state == EmergencyStateEnum.initial ||
                                    emergencyState.state == EmergencyStateEnum.ready,
                            )) {
                                emergencyState.state = EmergencyStateEnum.calledBack;
                                emergencyState.save();
                                emergencyState.cancel();
                            }
                        }
                    });
                }
            });
    }
}

TriggerHandler.register(EmergencyStateTriggerHandler);
