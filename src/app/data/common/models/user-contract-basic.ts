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
import { ContractBasic } from './contract-basic';

export class UserContractBasic extends BaseModel {
    public static PARSE_CLASSNAME = 'UserContractBasic';

    private _signedAt: Date;
    private _signature: Parse.File;
    private _contract: ContractBasic;

    constructor() {
        super(UserContractBasic.PARSE_CLASSNAME);
    }

    public get signedAt(): Date {
        return this._signedAt;
    }

    public set signedAt(value: Date) {
        this._signedAt = value;
    }

    public get signature(): Parse.File {
        return this._signature;
    }

    public set signature(value: Parse.File) {
        this._signature = value;
    }

    public get contract(): ContractBasic {
        return this._contract;
    }

    public set contract(value: ContractBasic) {
        this._contract = value;
    }
}

BaseModel.registerClass(UserContractBasic, UserContractBasic.PARSE_CLASSNAME);

