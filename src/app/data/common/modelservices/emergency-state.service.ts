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

import { Injectable } from '@angular/core';
import { ErrorService, ParseService, Parse, Subscription } from '../services';
import { Emergency, EmergencyState, EmergencyStateEnum } from '../models';
import { BaseModelService } from './base/base-modelservice';

@Injectable()
export class EmergencyStateService extends BaseModelService<EmergencyState> {
    constructor(protected errorService: ErrorService, protected parseService: ParseService) {
        super(errorService, parseService, EmergencyState);
    }

    public getByEmergency(emergency: Emergency, greaterThanOrEqualState?: number): Promise<Array<EmergencyState>> {
        return new Promise<Array<EmergencyState>>((resolve, reject) => {
            const query = new Parse.Query(EmergencyState);
            query.equalTo('emergencyRelation', emergency);
            if (greaterThanOrEqualState) {
                query.greaterThanOrEqualTo('state', greaterThanOrEqualState);
            }
            query.include('userRelation');
            query.include('protocolRelation');
            query.limit(99999999);
            query.find().then(
                (emergencyStates) => resolve(emergencyStates),
                (error) => this.errorService.handleParseErrors(error),
            );
        });
    }

    public subByEmergency(emergency: Emergency): Promise<Subscription<EmergencyState>> {
        return new Promise<Subscription<EmergencyState>>((resolve, reject) => {
            const query = new Parse.Query(EmergencyState);
            query.equalTo('emergencyRelation', emergency);
            query.include('userRelation');
            this.parseService.subscribe<EmergencyState>(query).then((subscription) => resolve(subscription));
        });
    }

    public getUncontactedFRCount(emergency: Emergency): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const query = new Parse.Query(EmergencyState);
            query.equalTo('emergencyRelation', emergency);
            query.greaterThan('state', EmergencyStateEnum.aborted);
            query.equalTo('contactedAt', null);

            query.count().then(
                (totalCount) => resolve(totalCount),
                (error) => this.errorService.handleParseErrors(error),
            );
        });
    }

    public getInvolvedFRCount(emergency: Emergency): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const query = new Parse.Query(EmergencyState);
            query.equalTo('emergencyRelation', emergency);
            query.greaterThan('state', EmergencyStateEnum.aborted);
            query.count().then(
                (totalCount) => resolve(totalCount),
                (error) => this.errorService.handleParseErrors(error),
            );
        });
    }
}
