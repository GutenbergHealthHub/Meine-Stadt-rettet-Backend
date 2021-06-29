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

import { BaseModel, Parse } from './base';
import { User } from './user';
import { RolePrivilegeEnum, RoleRestrictionEnum } from './transient';

export class Role extends BaseModel {
    public static PARSE_CLASSNAME = '_Role';

    private _name: string;
    private _startUrl: string;
    private _roles: Parse.Relation<Role>;
    private _users: Array<User>;
    private _privileges: Array<RolePrivilegeEnum>;
    private _restrictions: Array<RoleRestrictionEnum>;

    constructor() {
        super(Role.PARSE_CLASSNAME);
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get startUrl(): string {
        return this._startUrl;
    }

    public set startUrl(value: string) {
        this._startUrl = value;
    }

    public get roles(): Parse.Relation<Role> {
        return this._roles;
    }

    public set roles(value: Parse.Relation<Role>) {
        this._roles = value;
    }

    public get users(): Array<User> {
        return this._users;
    }

    public set users(value: Array<User>) {
        this._users = value;
    }

    public get privileges(): Array<RolePrivilegeEnum> {
        return this._privileges;
    }

    public set privileges(value: Array<RolePrivilegeEnum>) {
        this._privileges = value;
    }

    public get restrictions(): Array<RoleRestrictionEnum> {
        return this._restrictions;
    }

    public set restrictions(value: Array<RoleRestrictionEnum>) {
        this._restrictions = value;
    }
}

BaseModel.registerClass(Role, Role.PARSE_CLASSNAME);
