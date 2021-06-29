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
import { Installation } from '../models';
import { BaseModelService } from './base/base-modelservice';
import { User } from '../models';
import { UserService } from './user.service';
import { Configuration } from '../models';
import { ServiceManager } from '../services/service-manager';

@Injectable()
export class InstallationService extends BaseModelService<Installation>  {

    private userService = ServiceManager.get(UserService);

    constructor(protected errorService: ErrorService, protected parseService: ParseService) {
        super(errorService, parseService, Installation);
    }

    public getLatestOfUser(user: User): Promise<Installation> {
        return new Promise<Installation>((resolve, reject) => {
            const query = this.createQuery();
            query.equalTo('userRelation', user);
            query.include('userRelation');
            query.descending('createdAt');
            query.first().then(installation => resolve(installation), error => this.errorService.handleParseErrors(error));
        });
    }

    public getAllOrderedByCreationDesc(): Promise<Array<Installation>> {
        return new Promise<Array<Installation>>((resolve, reject) => {
            const query = this.createQuery();
            query.include('userRelation');
            query.descending('createdAt');
            query.limit(99999999);
            query.find().then(installationList => resolve(installationList), error => this.errorService.handleParseErrors(error));
        });
    }

    public getAllInRangeByConfig(location: Parse.GeoPoint, config: Configuration): Promise<Array<Installation>> {
        return new Promise<Array<Installation>>((resolve, reject) => {
            const userQuery = this.userService.createQuery()
                .equalTo('emailVerified', true)
                .equalTo('activated', true)
                .lessThan('pausedUntil', new Date())
                .notEqualTo('dutyOff', true)
                .notContainedIn('dutyDays', [new Date().getDay()])
                .withinKilometers('location', location, (config.distance / 1000))
                .limit(9999999999);

            if (config.constraints) {
                if (config.constraints.professions) {
                    userQuery.notContainedIn('profession', config.constraints.professions);
                }
                if (config.constraints.qualifications) {
                    userQuery.notContainedIn('qualification', config.constraints.qualifications);
                }
            }

            const query = this.createQuery()
                .ascending('deviceType')
                .addAscending('userRelation')
                .addDescending('createdAt')
                .matchesQuery('userRelation', userQuery)
                .include('userRelation')
                .limit(999999999);

            query.find().then(installationList => resolve(installationList), error => this.errorService.handleParseErrors(error));
        });
    }
}
