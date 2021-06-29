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
import { UserProfessionEnum, UserQualificationEnum } from './transient';

export interface ConfigurationConstraints {
    professions?: Array<UserProfessionEnum>;
    qualifications?: Array<UserQualificationEnum>;
}

export class Configuration extends BaseModel {
    public static PARSE_CLASSNAME = 'Configuration';

    private _distance: number;
    private _controlCenterRelation: ControlCenter;
    private _isRescuerCountLimited: boolean;
    private _rescuerLimitation: number;
    private _constraints: ConfigurationConstraints;
    private _isAEDFirstresponder: boolean;
    private _isGlobalFirstresponder: boolean;

    constructor() {
        super(Configuration.PARSE_CLASSNAME);
    }

    public get distance(): number {
        return this._distance;
    }

    public set distance(value: number) {
        this._distance = value;
    }

    public get controlCenterRelation(): ControlCenter {
        return this._controlCenterRelation;
    }

    public set controlCenterRelation(value: ControlCenter) {
        this._controlCenterRelation = value;
    }

    public get constraints(): ConfigurationConstraints {
        return this._constraints;
    }

    public set constraints(value: ConfigurationConstraints) {
        this._constraints = value;
    }

    public get isAEDFirstresponder(): boolean {
        return this._isAEDFirstresponder;
    }

    public set isAEDFirstresponder(value: boolean) {
        this._isAEDFirstresponder = value;
    }

    public get isGlobalFirstresponder(): boolean {
        return this._isGlobalFirstresponder;
    }

    public set isGlobalFirstresponder(value: boolean) {
        this._isGlobalFirstresponder = value;
    }

    public get isRescuerCountLimited(): boolean {
        return this._isRescuerCountLimited;
    }

    public set isRescuerCountLimited(value: boolean) {
        this._isRescuerCountLimited = value;
    }

    public get rescuerLimitation(): number {
        return this._rescuerLimitation;
    }

    public set rescuerLimitation(value: number) {
        this._rescuerLimitation = value;
    }
}

BaseModel.registerClass(Configuration, Configuration.PARSE_CLASSNAME);
