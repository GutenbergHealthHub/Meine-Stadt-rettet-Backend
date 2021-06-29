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
import { ErrorService, ParseService, Parse } from '../services';
import { Configuration, ControlCenter, Emergency, AlertingRegion } from '../models';

@Injectable()
export class ConfigurationService {

    constructor(private errorService: ErrorService, private parseService: ParseService) {
    }

    public getByControlCenter(controlCenter: ControlCenter): Promise<Configuration> {
        return new Promise<Configuration>((resolve, reject) => {
            const query = new Parse.Query(Configuration);
            query.equalTo('controlCenterRelation', controlCenter);
            query.first().then(configuration => resolve(configuration), error => this.errorService.handleParseErrors(error));
        });
    }

    public getDefault(controlCenter: ControlCenter): Configuration {
        const configuration = new Configuration();
        configuration.distance = 1000;
        configuration.controlCenterRelation = controlCenter;
        return configuration;
    }

    public getByEmergency(emergency: Emergency): Promise<Configuration> {
        return new Promise<Configuration>((resolve, reject) => {

            this.getByControlCenter(emergency.controlCenterRelation).then(configuration => {
                if (!configuration) {
                    configuration = this.getDefault(emergency.controlCenterRelation);
                }

                const query = new Parse.Query(AlertingRegion);
                query.equalTo('controlCenterRelation', emergency.controlCenterRelation);
                query.equalTo('activated', true);
                query.find().then(regions => {
                    for (const region of regions) {
                        const distance = region.location.kilometersTo(emergency.locationPoint) * 1000;
                        if (distance <= region.circleRadius && region.alertingRadius < configuration.distance) {
                            configuration.distance = region.alertingRadius;
                        }
                    }
                    resolve(configuration);
                }, error => this.errorService.handleParseErrors(error));
            });
        });
    }
}
