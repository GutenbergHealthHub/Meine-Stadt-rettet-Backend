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
import { ParseService } from '../services';

export enum InstallationDeviceEnum {
    ios = 'ios',
    android = 'android',
}

export class Installation extends Parse.Installation {
    public static PARSE_CLASSNAME = '_Installation';

    private _parseVersion: string;
    private _userRelation: User;
    private _appIdentifier: string;
    private _appName: string;
    private _appVersion: string;
    private _localeIdentifier: string;
    private _deviceType: InstallationDeviceEnum;

    constructor() {
        super();
    }

    public get parseVersion(): string {
        return this._parseVersion;
    }

    public set parseVersion(value: string) {
        this._parseVersion = value;
    }

    public get userRelation(): User {
        return this._userRelation;
    }

    public set userRelation(value: User) {
        this._userRelation = value;
    }

    public get appIdentifier(): string {
        return this._appIdentifier;
    }

    public set appIdentifier(value: string) {
        this._appIdentifier = value;
    }

    public get appName(): string {
        return this._appName;
    }

    public set appName(value: string) {
        this._appName = value;
    }

    public get appVersion(): string {
        return this._appVersion;
    }

    public set appVersion(value: string) {
        this._appVersion = value;
    }

    public get deviceType(): InstallationDeviceEnum {
        return this._deviceType;
    }

    public set deviceType(value: InstallationDeviceEnum) {
        this._deviceType = value;
    }

    public save(): Promise<this> {
        for (const attrKey of Object.keys(this)) {
            if (attrKey[0] === '_' && attrKey !== '_objCount') {
                this.set(attrKey.substr(1), this[attrKey]);
            }
        }
        if (ParseService.isParseServer()) {
            return super.save(null, { useMasterKey: true });
        } else {
            return super.save();
        }
    }

    public get localeIdentifier() {
        return this._localeIdentifier;
    }

    public set localeIdentifier(value) {
        this._localeIdentifier = value;
    }

    private _setExisted(isExisted: boolean) {
        if (!this.existed()) {
            for (const attrKey of Object.keys(this)) {
                if (attrKey[0] === '_' && attrKey !== '_objCount' && attrKey !== '_id') {
                    delete this[attrKey];
                }
            }
        }

        for (const attrKey of Object.keys(this.attributes)) {
            if (this[attrKey] === undefined) {
                this['_' + attrKey] = this.get(attrKey);
            }
        }
        super['_setExisted'](isExisted);
    }
}

BaseModel.registerClass(Installation, Installation.PARSE_CLASSNAME);
