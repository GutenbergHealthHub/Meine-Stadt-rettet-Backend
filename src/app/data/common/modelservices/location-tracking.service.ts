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
import { EmergencyState, LocationTracking } from '../models';
import { BaseModelService } from './base/base-modelservice';

@Injectable()
export class LocationTrackingService extends BaseModelService<LocationTracking> {

    constructor(protected errorService: ErrorService, protected parseService: ParseService) {
        super(errorService, parseService, LocationTracking);
    }

    public subByEmergencyState(emergencyState: EmergencyState): Promise<Subscription<LocationTracking>> {
        return new Promise<Subscription<LocationTracking>>((resolve, reject) => {
            const query = new Parse.Query(LocationTracking);
            query.equalTo('emergencyStateRelation', emergencyState);
            query.descending('createdAt');
            this.parseService.subscribe<LocationTracking>(query).then(subscription => resolve(subscription));
        });
    }
}
