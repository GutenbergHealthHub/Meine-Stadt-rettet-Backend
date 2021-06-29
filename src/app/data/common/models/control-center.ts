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

import { BaseModel } from './base';

export class ControlCenter extends BaseModel {
    public static PARSE_CLASSNAME = 'ControlCenter';

    private _zip: string;
    private _faxNumber: string;
    private _city: string;
    private _name: string;
    private _address: string;
    private _phoneNumber: string;
    private _SMSAPItrustedSenders: Array<string>;

    constructor() {
        super(ControlCenter.PARSE_CLASSNAME);
        this.SMSAPItrustedSenders = new Array<string>();
    }

    public get zip(): string {
        return this._zip;
    }

    public set zip(value: string) {
        this._zip = value;
    }

    public get faxNumber(): string {
        return this._faxNumber;
    }

    public set faxNumber(value: string) {
        this._faxNumber = value;
    }

    public get city(): string {
        return this._city;
    }

    public set city(value: string) {
        this._city = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get address(): string {
        return this._address;
    }

    public set address(value: string) {
        this._address = value;
    }

    public get phoneNumber(): string {
        return this._phoneNumber;
    }

    public set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    public get SMSAPItrustedSenders(): Array<string> {
        return this._SMSAPItrustedSenders;
    }


    public set SMSAPItrustedSenders(value: Array<string>) {
        this._SMSAPItrustedSenders = value;
    }

    public isTrustedSMSAPISender(sender: string): boolean {
        if (!this.SMSAPItrustedSenders) {
            return false;
        }
        return this.SMSAPItrustedSenders.filter((value) => {
            const cleanedValue = value.replace(/[^0-9a-zA-Z]/g, '');
            const cleanedSender = sender.replace(/[^0-9a-zA-Z]/g, '');
            return (cleanedSender && cleanedValue && cleanedSender === cleanedValue);
        }).length > 0;
    }
}

BaseModel.registerClass(ControlCenter, ControlCenter.PARSE_CLASSNAME);
