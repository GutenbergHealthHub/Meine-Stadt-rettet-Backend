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

export class ContractBasic extends BaseModel {
    public static PARSE_CLASSNAME = 'ContractBasic';

    private _validUntil: Date;
    private _validFrom: Date;
    private _url: string;
    private _state: string;
    private _subtitle: string;
    private _version: string;
    private _title: string;

    constructor() {
        super(ContractBasic.PARSE_CLASSNAME);
    }

    public get validUntil(): Date {
        return this._validUntil;
    }

    public set validUntil(value: Date) {
        this._validUntil = value;
    }

    public get validFrom(): Date {
        return this._validFrom;
    }

    public set validFrom(value: Date) {
        this._validFrom = value;
    }

    public get url(): string {
        return this._url;
    }

    public set url(value: string) {
        this._url = value;
    }

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        this._state = value;
    }

    public get subtitle(): string {
        return this._subtitle;
    }

    public set subtitle(value: string) {
        this._subtitle = value;
    }

    public get version(): string {
        return this._version;
    }

    public set version(value: string) {
        this._version = value;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

}

BaseModel.registerClass(ContractBasic, ContractBasic.PARSE_CLASSNAME);

