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
import { Role, User } from '../models';

@Injectable()
export class RoleService {

    constructor(private errorService: ErrorService, private parseService: ParseService) {
    }

    public getUserRoles(user: User): Promise<Array<Role>> {
        return new Promise<Array<Role>>((resolve, reject) => {
            const query = new Parse.Query(Role);
            query.equalTo('users', Parse.User.current());
            query.find().then(roles => {
                this.addChildRoles(roles).then(allRoles => resolve(allRoles));
            }, error => this.errorService.handleParseErrors(error));
        });
    }

    private addChildRoles(roleArray: Array<Role>): Promise<Array<Role>> {
        return new Promise<Array<Role>>((resolve, reject) => {
            let resultRoles = roleArray;
            if (roleArray.length === 0) {
                resolve(roleArray);
            } else {
                roleArray.forEach((role) => {
                    role.roles.query().find().then((roles) => {
                        resultRoles = resultRoles.concat(roles as Array<Role>);
                        this.addChildRoles(roles as Array<Role>).then((additionalRoles) => {
                            resolve(resultRoles.concat(additionalRoles));
                        });
                    });
                });
            }
        });
    }
}
