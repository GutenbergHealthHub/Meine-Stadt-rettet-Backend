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
import { ControlCenter } from './control-center';

export class AlertingRegion extends BaseModel {
    public static PARSE_CLASSNAME = 'AlertingRegion';

    private _name: string;
    private _location: Parse.GeoPoint;
    private _circleRadius: number;
    private _alertingRadius: number;
    private _controlCenterRelation: ControlCenter;
    private _activated: boolean;

    constructor() {
        super(AlertingRegion.PARSE_CLASSNAME);
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get location(): Parse.GeoPoint {
        return this._location;
    }

    public set location(value: Parse.GeoPoint) {
        this._location = value;
    }

    public get circleRadius(): number {
        return this._circleRadius;
    }

    public set circleRadius(value: number) {
        this._circleRadius = value;
    }

    public get alertingRadius(): number {
        return this._alertingRadius;
    }

    public set alertingRadius(value: number) {
        this._alertingRadius = value;
    }

    public get controlCenterRelation(): ControlCenter {
        return this._controlCenterRelation;
    }

    public set controlCenterRelation(value: ControlCenter) {
        this._controlCenterRelation = value;
    }

    public get activated(): boolean {
        return this._activated;
    }

    public set activated(value: boolean) {
        this._activated = value;
    }
}

BaseModel.registerClass(AlertingRegion, AlertingRegion.PARSE_CLASSNAME);
