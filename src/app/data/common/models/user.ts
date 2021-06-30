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
import { UserContractBasic } from './user-contract-basic';
import { Certificate } from './certificate';
import {
    UserProfessionEnum,
    UserProfessionEnumText,
    UserQualificationEnum,
    UserQualificationEnumText,
} from './transient';
import { ParseService } from '../services';

export class User extends Parse.User {
    public static PARSE_CLASSNAME = '_User';

    private _id: string;
    private _location: Parse.GeoPoint;
    private _lastname: string;
    private _username: string;
    private _firstname: string;
    private _email: string;
    private _zip: number;
    private _city: string;
    private _country: string;
    private _controlCenterRelation: ControlCenter;
    private _birthdate: Date;
    private _sound: string;
    private _qualification: UserQualificationEnum;
    private _profession: UserProfessionEnum;
    private _code: string;
    private _phoneNumber: number;
    private _phoneCode: number;
    private _activated: boolean;
    private _emailVerified: boolean;
    private _comments: string;
    private _lastBLSCourse: Date;
    private _insuranceType: string;
    private _userContractBasic: UserContractBasic;
    private _certificateFR: Certificate;
    private _certificates: Array<Certificate>;
    private _thoroughfare: string;
    private _subThoroughfare: string;
    private _state: string;
    private _logEntries: number;
    private _receivesPracticeAlarm: boolean;
    private _dutyFrom: Date;
    private _dutyTo: Date;
    private _dutyOff: boolean;
    private _dutyDays: Array<number>;
    private _dutyHome: boolean;

    constructor() {
        super(User.PARSE_CLASSNAME);
    }

    public setAttribute(attribute: string, value: any) {
        return new Promise<void>((resolve, reject) => {
            Parse.Cloud.run(
                'modifyUser',
                { userid: this.id, input: value, key: attribute },
                {
                    success: (user) => {
                        if (value !== 'null') {
                            this[attribute] = value;
                        }
                        this.activated = user.activated;
                        resolve();
                    },
                    error: (error) => {
                        reject(error);
                    },
                },
            );
        });
    }

    public setCertificateActivated() {
        return new Promise<void>((resolve, reject) => {
            Parse.Cloud.run(
                'sendCertificateActivated',
                { userId: this.id },
                {
                    success: () => {
                        resolve();
                    },
                    error: (error) => {
                        reject(error);
                    },
                },
            );
        });
    }

    public sendMail(mailType: string) {
        return new Promise<void>((resolve, reject) => {
            Parse.Cloud.run(
                'sendEmail',
                {
                    emailTemplate: mailType,
                    target: this.username,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    link: 'www.meine-stadt-rettet.de',
                },
                {
                    success: () => {
                        resolve();
                    },
                    error: (error) => {
                        reject(error);
                    },
                },
            );
        });
    }

    public deleteUser(id: string) {
        return new Promise<void>((resolve, reject) => {
            Parse.Cloud.run(
                'deleteUser',
                {
                    userId: id,
                },
                {
                    success: () => {
                        resolve();
                    },
                    error: (error) => {
                        reject(error);
                    },
                },
            );
        });
    }

    public createTestAlarm(id: string) {
        return new Promise<void>((resolve, reject) => {
            Parse.Cloud.run(
                'createTestAlarm',
                {
                    userId: id,
                    controlCenter: Parse.User.current().get('controlCenterRelation').get('name'),
                },
                {
                    success: () => {
                        resolve();
                    },
                    error: (error) => {
                        reject(error);
                    },
                },
            );
        });
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get location(): Parse.GeoPoint {
        return this._location;
    }

    public set location(value: Parse.GeoPoint) {
        this._location = value;
    }

    public get lastname(): string {
        return this._lastname;
    }

    public set lastname(value: string) {
        this._lastname = value;
    }

    public get username(): string {
        return this._username;
    }

    public set username(value: string) {
        this._username = value;
    }

    public get firstname(): string {
        return this._firstname;
    }

    public set firstname(value: string) {
        this._firstname = value;
    }

    public get email(): string {
        return this._email;
    }

    public set email(value: string) {
        this._email = value;
    }

    public get zip(): number {
        return this._zip;
    }

    public set zip(value: number) {
        this._zip = value;
    }

    public get city(): string {
        return this._city;
    }

    public set city(value: string) {
        this._city = value;
    }

    public get country(): string {
        return this._country;
    }

    public set country(value: string) {
        this._country = value;
    }

    public get birthdate(): Date {
        return this._birthdate;
    }

    public set birthdate(value: Date) {
        this._birthdate = value;
    }

    public get controlCenterRelation(): ControlCenter {
        return this._controlCenterRelation;
    }

    public set controlCenterRelation(value: ControlCenter) {
        this._controlCenterRelation = value;
    }

    public get sound(): string {
        return this._sound;
    }

    public set sound(value: string) {
        this._sound = value;
    }

    public get qualification(): UserQualificationEnum {
        return this._qualification;
    }

    public get qualificationText(): string {
        if (isNaN(Number(this.qualification))) {
            return this.qualification as any;
        }
        return UserQualificationEnumText.get(this.qualification);
    }

    public set qualification(value: UserQualificationEnum) {
        this._qualification = value;
    }

    public get profession(): UserProfessionEnum {
        return this._profession;
    }

    public get professionText(): string {
        if (isNaN(Number(this.profession))) {
            return this.profession as any;
        }
        return UserProfessionEnumText.get(this.profession);
    }

    public set profession(value: UserProfessionEnum) {
        this._profession = value;
    }

    public get phoneNumber(): number {
        return this._phoneNumber;
    }

    public set phoneNumber(value: number) {
        this._phoneNumber = value;
    }

    public get phoneCode(): number {
        return this._phoneCode;
    }

    public set phoneCode(value: number) {
        this._phoneCode = value;
    }

    public get activated(): boolean {
        return this._activated;
    }

    public set activated(value: boolean) {
        this._activated = value;
    }

    public get emailVerified(): boolean {
        return this._emailVerified;
    }

    public set emailVerified(value: boolean) {
        this._emailVerified = value;
    }

    public get comments(): string {
        return this._comments;
    }

    public set comments(value: string) {
        this._comments = value;
    }

    public get lastBLSCourse(): Date {
        return this._lastBLSCourse;
    }

    public set lastBLSCourse(value: Date) {
        this._lastBLSCourse = value;
    }

    public get userContractBasic(): UserContractBasic {
        return this._userContractBasic;
    }

    public set userContractBasic(value: UserContractBasic) {
        this._userContractBasic = value;
    }

    public get certificateFR(): Certificate {
        return this._certificateFR;
    }

    public set certificateFR(value: Certificate) {
        this._certificateFR = value;
    }

    public get certificates(): Array<Certificate> {
        return this._certificates;
    }

    public set certificates(value: Array<Certificate>) {
        this._certificates = value;
    }

    public get thoroughfare(): string {
        return this._thoroughfare;
    }

    public set thoroughfare(value: string) {
        this._thoroughfare = value;
    }

    public get subThoroughfare(): string {
        return this._subThoroughfare;
    }

    public set subThoroughfare(value: string) {
        this._subThoroughfare = value;
    }

    public get code(): string {
        return this._code;
    }

    public set code(value: string) {
        this._code = value;
    }

    public get insuranceType(): string {
        return this._insuranceType;
    }

    public set insuranceType(value: string) {
        this._insuranceType = value;
    }

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        this._state = value;
    }

    get logEntries(): number {
        return this._logEntries;
    }

    set logEntries(value: number) {
        this._logEntries = value;
    }

    get receivesPracticeAlarm(): boolean {
        return this._receivesPracticeAlarm;
    }

    set receivesPracticeAlarm(value: boolean) {
        this._receivesPracticeAlarm = value;
    }

    get dutyFrom(): Date {
        return this._dutyFrom;
    }

    set dutyFrom(value: Date) {
        this._dutyFrom = value;
    }

    get dutyTo(): Date {
        return this._dutyTo;
    }

    set dutyTo(value: Date) {
        this._dutyTo = value;
    }

    get dutyOff(): boolean {
        return this._dutyOff;
    }

    set dutyOff(value: boolean) {
        this._dutyOff = value;
    }

    get dutyDays(): Array<number> {
        return this._dutyDays;
    }

    set dutyDays(value: Array<number>) {
        this._dutyDays = value;
    }

    get dutyHome(): boolean {
        return this._dutyHome;
    }

    set dutyHome(value: boolean) {
        this._dutyHome = value;
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

BaseModel.registerClass(User, User.PARSE_CLASSNAME);
