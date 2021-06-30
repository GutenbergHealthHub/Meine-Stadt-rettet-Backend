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

import { BaseModel, IPointer } from './base';

export enum CertificateStateEnum {
    initial = 1,
    approved = 2,
}

export enum CertificateTypeEnum {
    additionalCertificate = 0,
    mainCertificate = 1,
}

export class Certificate extends BaseModel {
    public static PARSE_CLASSNAME = 'Certificate';

    private _state: CertificateStateEnum;
    private _title: string;
    private _type: CertificateTypeEnum;
    private _file: Parse.File;
    private _stateText: string;

    constructor() {
        super(Certificate.PARSE_CLASSNAME);
    }

    public get state(): CertificateStateEnum {
        return this._state;
    }

    public set state(value: CertificateStateEnum) {
        this._state = value;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get type(): CertificateTypeEnum {
        return this._type;
    }

    public set type(value: CertificateTypeEnum) {
        this._type = value;
    }

    public get file(): Parse.File {
        return this._file;
    }

    public set file(value: Parse.File) {
        this._file = value;
    }

    public get stateText(): string {
        return this._stateText;
    }

    public set stateText(value: string) {
        this._stateText = value;
    }
}

BaseModel.registerClass(Certificate, Certificate.PARSE_CLASSNAME);
