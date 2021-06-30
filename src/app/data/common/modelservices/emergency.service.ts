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
import { BaseModelService } from './base/base-modelservice';
import { ErrorService, ParseService, Parse, Subscription } from '../services';
import { Emergency, EmergencyEnum, EmergencyState, EmergencyStateEnum, PageInfo, User } from '../models';

@Injectable()
export class EmergencyService extends BaseModelService<Emergency> {
    constructor(errorService: ErrorService, parseService: ParseService) {
        super(errorService, parseService, Emergency);
    }

    public getByState(state: EmergencyEnum, pageInfo?: PageInfo): Promise<Array<Emergency>> {
        return new Promise<Array<Emergency>>((resolve, reject) => {
            let query = this.createQuery();
            query.greaterThanOrEqualTo('state', state);
            query = this.applyPageInfo(query, pageInfo, this.filterByFirstresponders);
            query.find().then(
                (emergencies) => resolve(emergencies),
                (error) => this.errorService.handleParseErrors(error),
            );
        });
    }

    private filterByFirstresponders(query: Parse.Query<Emergency>, filterQuery: string): Parse.Query<Emergency> {
        const newQuery = new Parse.Query(Emergency);
        const queries = new Array<Parse.Query<User>>();
        ['firstname', 'lastname'].forEach((attribute) => {
            for (const filterSubQuery of filterQuery.replace(',', ' ').replace('  ', ' ').split(' ')) {
                const orQuery = new Parse.Query(User);
                orQuery.matches(attribute, new RegExp(filterSubQuery), 'i');
                queries.push(orQuery);
            }
        });
        const userQuery = Parse.Query.or<User>(...queries);
        const emergencyStateQuery = new Parse.Query(EmergencyState);
        emergencyStateQuery.containedIn('state', [EmergencyStateEnum.finished, EmergencyStateEnum.aborted]);
        emergencyStateQuery.matchesKeyInQuery('emergencyRelation', 'objectId', query);
        emergencyStateQuery.matchesKeyInQuery('userRelation', 'objectId', userQuery);
        newQuery.matchesKeyInQuery('objectId', 'emergencyRelation.objectId', emergencyStateQuery);
        return newQuery;
    }

    public subById(emergencyId: string): Promise<Subscription<Emergency>> {
        return new Promise<Subscription<Emergency>>((resolve, reject) => {
            const query = this.createQuery();
            query.equalTo('objectId', emergencyId);
            this.parseService.subscribe<Emergency>(query).then((subscription) => resolve(subscription));
        });
    }

    public subByState(state: EmergencyEnum): Promise<Subscription<Emergency>> {
        return new Promise<Subscription<Emergency>>((resolve, reject) => {
            const query = this.createQuery();
            query.descending('createdAt');
            query.equalTo('state', state);
            this.parseService.subscribe<Emergency>(query).then((subscription) => resolve(subscription));
        });
    }

    public subActiveEmergency(emergencyId: string): Promise<Subscription<Emergency>> {
        return new Promise<Subscription<Emergency>>((resolve, reject) => {
            const query = this.createQuery();
            query.equalTo('objectId', emergencyId);
            query.lessThan('state', 20);
            this.parseService.subscribe<Emergency>(query).then((subscription) => resolve(subscription));
        });
    }

    public subActiveEmergencies(): Promise<Subscription<Emergency>> {
        return new Promise<Subscription<Emergency>>((resolve, reject) => {
            const query = this.createQuery();
            query.descending('createdAt');
            query.lessThan('state', 20);
            this.parseService.subscribe<Emergency>(query).then((subscription) => resolve(subscription));
        });
    }

    public createQuery(includes?: [keyof Emergency]): Parse.Query<Emergency> {
        const query = super.createQuery(includes);
        if (!ParseService.isParseServer()) {
            query.exists('controlCenterRelation');
            query.equalTo('controlCenterRelation', Parse.User.current().get('controlCenterRelation'));
        }
        return query;
    }
}
