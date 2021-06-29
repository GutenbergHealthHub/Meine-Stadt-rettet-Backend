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
import { Certificate, PageInfo, User } from '../models';
import { BaseModelService } from './base/base-modelservice';

@Injectable()
export class UserService extends BaseModelService<User> {

    constructor(errorService: ErrorService, parseService: ParseService) {
        super(errorService, parseService, User);
    }
    public getById(userId: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            const query = new Parse.Query(User);
            query.equalTo('objectId', userId);
            query.include('controlCenterRelation');
            query.include('certificateFR');
            query.include('certificates');
            query.include('userContractBasic');
            query.first().then(firstresponder => resolve(firstresponder), error => this.errorService.handleParseErrors(error));
        });
    }

    // @ts-ignore (todo: rename)
    public getByFilter(searchQuery?: string, pageInfo?: PageInfo, uncheckedOnly: Boolean = false, origin?: string): Promise<Array<User>> {
        return new Promise<Array<User>>((resolve, reject) => {
            let query = new Parse.Query(User);
            if (uncheckedOnly) {
                this.limitQueryToUncheckedUsers(query);
            }

            if (pageInfo) {
                pageInfo.filterQuery = searchQuery;
                query = this.applyPageInfo(query, pageInfo, this.filterByAttributes);
            } else {
                query = this.applyFilter(query, searchQuery, this.filterByAttributes);
            }
            if (origin) {
                query.equalTo('origin', origin);
            }
            query.include('certificateFR');
            query.include('certificates');
            query.include('userContractBasic');
            query.doesNotExist('authData.anonymous.id');
            query.find().then(firstresponders => resolve(firstresponders), error => this.errorService.handleParseErrors(error));
        });
    }

    private filterByAttributes(query: Parse.Query<User>, filterQuery: string): Parse.Query<User> {
        const queries = new Array<Parse.Query<User>>();
        ['firstname', 'lastname', 'username'].forEach((attribute) => {
            const orQuery = new Parse.Query(User);
            orQuery.matches(attribute, new RegExp(filterQuery), 'i');
            queries.push(orQuery);
        });
        return Parse.Query.or<User>(...queries);
    }

    public getAll(): Promise<Array<User>> {
        return new Promise<Array<User>>((resolve, reject) => {
            const query = new Parse.Query(User);
            query.limit(99999999999);
            query.find().then(firstresponders => resolve(firstresponders), error => this.errorService.handleParseErrors(error));
        });
    }

    public sub(user: User): Promise<Subscription<User>> {
        return new Promise<Subscription<User>>((resolve, reject) => {
            const query = new Parse.Query(User);
            query.equalTo('objectId', user.id);
            query.include('controlCenterRelation');
            this.parseService.subscribe<User>(query).then(subscription => resolve(subscription));
        });
    }

    public subById(userId: string): Promise<Subscription<User>> {
        return new Promise<Subscription<User>>((resolve, reject) => {
            const query = new Parse.Query(User);
            query.equalTo('objectId', userId);
            query.include('controlCenterRelation');
            this.parseService.subscribe<User>(query).then(subscription => resolve(subscription));
        });
    }

    public subByUsername(username: string): Promise<Subscription<User>> {
        return new Promise<Subscription<User>>((resolve, reject) => {
            const query = new Parse.Query(User);
            query.equalTo('username', username);
            this.parseService.subscribe<User>(query).then(subscription => resolve(subscription));
        });
    }

    public limitQueryToUncheckedUsers(query: Parse.Query) {

        query.equalTo('activated', false);
        query.equalTo('emailVerified', true);
        query.exists('certificateFR');
        query.exists('userContractBasic');

        const innerQueryCertificate = new Parse.Query(Certificate);
        innerQueryCertificate.exists('file');

        query.matchesQuery('certificateFR', innerQueryCertificate);
    }
}
