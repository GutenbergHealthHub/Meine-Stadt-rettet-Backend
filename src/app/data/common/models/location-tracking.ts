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
import { Emergency } from './emergency';
import { EmergencyState } from './emergency-state';

export class LocationTracking extends BaseModel {
    public static PARSE_CLASSNAME = 'LocationTracking';

    private _userRelation: User;
    private _emergencyRelation: Emergency;
    private _duration: number;
    private _location: Parse.GeoPoint;
    private _distance: number;
    private _emergencyStateRelation: EmergencyState;

    constructor() {
        super(LocationTracking.PARSE_CLASSNAME);
    }

    public get userRelation(): User {
        return this._userRelation;
    }

    public set userRelation(value: User) {
        this._userRelation = value;
    }

    public get emergencyRelation(): Emergency {
        return this._emergencyRelation;
    }

    public set emergencyRelation(value: Emergency) {
        this._emergencyRelation = value;
    }

    public get duration(): number {
        return this._duration;
    }

    public set duration(value: number) {
        this._duration = value;
    }

    public get location(): Parse.GeoPoint {
        return this._location;
    }

    public set location(value: Parse.GeoPoint) {
        this._location = value;
    }

    public get distance(): number {
        return this._distance;
    }

    public set distance(value: number) {
        this._distance = value;
    }

    public get emergencyStateRelation(): EmergencyState {
        return this._emergencyStateRelation;
    }

    public set emergencyStateRelation(value: EmergencyState) {
        this._emergencyStateRelation = value;
    }
}

BaseModel.registerClass(LocationTracking, LocationTracking.PARSE_CLASSNAME);
