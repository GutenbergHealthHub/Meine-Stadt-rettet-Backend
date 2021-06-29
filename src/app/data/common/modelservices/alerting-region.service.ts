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
import { ErrorService } from '../services/error.service';
import { ParseService, Parse } from '../services/parse.service';
import { AlertingRegion, ControlCenter } from '../models';

@Injectable()
export class AlertingRegionService {

    constructor(private errorService: ErrorService, private parseService: ParseService) {
    }

    public getByControlCenter(controlCenter: ControlCenter, activatedOnly: boolean = false): Promise<Array<AlertingRegion>> {
        return new Promise<Array<AlertingRegion>>((resolve, reject) => {
            const query = new Parse.Query(AlertingRegion);
            query.equalTo('controlCenterRelation', controlCenter);
            if (activatedOnly) {
                query.equalTo('activated', true);
            }
            query.find().then(regions => resolve(regions), error => this.errorService.handleParseErrors(error));
        });
    }

    public getById(id: String, activatedOnly: boolean = false): Promise<AlertingRegion> {
        return new Promise<AlertingRegion>((resolve, reject) => {
            const query = new Parse.Query(AlertingRegion);
            query.equalTo('objectId', id);
            if (activatedOnly) {
                query.equalTo('activated', true);
            }
            query.first().then(region => resolve(region), error => this.errorService.handleParseErrors(error));
        });
    }
}
