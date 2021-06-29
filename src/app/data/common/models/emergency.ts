
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
import { Configuration } from './configuration';
import { User } from './user';
import { UserProfessionEnum } from './transient';

export enum EmergencyEnum {
    new = 0,
    emergencyReceived = 1,
    firstresponderReady = 2,
    firstrespondersOnTheWay = 3,
    firstrespondersArrived = 4,
    abortedByAllFirstresponders = 10,
    successfullyFinished = 11,
    aborted = 12,
    done = 20,
    doneAndPostProcessed = 21
}

export enum EmergencyTaskEnum {
    firstaid = 0,
    getaed = 1,
    voluntary = 2
}

export let EmergencyTaskEnumText = new Map<EmergencyTaskEnum, string>()
    .set(EmergencyTaskEnum.firstaid, 'Ersthelfer')
    .set(EmergencyTaskEnum.getaed, 'AED Holer')
    .set(EmergencyTaskEnum.voluntary, 'Spontanhelfer');

enum EmergencyIncludes {
    controlCenterRelation = 'controlCenterRelation',
    configurationRelation = 'configurationRelation',
}

export class Emergency extends BaseModel {
    public static PARSE_CLASSNAME = 'Emergency';
    public static INCLUDABLES = EmergencyIncludes;

    private _zip: string;
    private _keyword: string;
    private _objectName: string;
    private _city: string;
    private _streetNumber: string;
    private _controlCenterRelation: ControlCenter;
    private _streetName: string;
    private _patientName: string;
    private _state: EmergencyEnum;
    private _configurationRelation: Configuration;
    private _country: string;
    private _NEFArrivalDate: Date;
    private _emergencyNumber: number;
    private _emergencyNumberDC: string;
    private _indicatorName: string;
    private _locationPoint: Parse.GeoPoint;
    private _informationString: string;
    private _plz: string;
    private _allFRcontacted: boolean;
    private _testEmergencySendBy: User;
    private _emergencyStateArray: Array<String>;
    private _firstresponderAccepted: boolean;
    private _involvedFR: number;
    private _emergencyTask: EmergencyTaskEnum;

    constructor() {
        super(Emergency.PARSE_CLASSNAME);
    }

    public cancel(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            Parse.Cloud.run('cancelEmergency', { emergencyId: this.id }).then(result => resolve(result), error => reject(error));
        });
    }

    public finish(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            Parse.Cloud.run('finishEmergency', { emergencyId: this.id }).then(result => resolve(result), error => reject(error));
        });
    }

    public get stateText(): string {
        switch (this.state) {
            case EmergencyEnum.new:
                return 'Neuer Notfall';
            case EmergencyEnum.emergencyReceived:
                return 'Notfall empfangen';
            case EmergencyEnum.firstresponderReady:
                return 'Notfall gesehen';
            case EmergencyEnum.firstrespondersOnTheWay:
                return 'Ersthelfer auf dem Weg';
            case EmergencyEnum.firstrespondersArrived:
                return 'Ersthelfer am Einsatzort';
            case EmergencyEnum.abortedByAllFirstresponders:
                return 'Abbruch durch alle Ersthelfer';
            case EmergencyEnum.successfullyFinished:
                return 'Erfolgreich abgeschlossen';
            case EmergencyEnum.aborted:
                return 'Manuell abgebrochen';
            case EmergencyEnum.done:
                return 'Notfall beendet';
            case EmergencyEnum.doneAndPostProcessed:
                return 'Postbearbeiteter Notfall';
            default:
                return '!!UNBEKANNTER STATUS';
        }
    }

    public get taskText(): string {
        switch (this._emergencyTask) {
            case EmergencyTaskEnum.firstaid:
                return 'Ersthelfer';
            case EmergencyTaskEnum.getaed:
                return 'AED Holer';
            case EmergencyTaskEnum.voluntary:
                return 'Spontanhelfer';
            default:
                return 'UNBEKANNTE AUFGABE';
        }
    }

    public get zip(): string {
        return this._zip;
    }

    public set zip(value: string) {
        this._zip = value;
    }

    public get keyword(): string {
        return this._keyword;
    }

    public set keyword(value: string) {
        this._keyword = value;
    }

    public get objectName(): string {
        return this._objectName;
    }

    public set objectName(value: string) {
        this._objectName = value;
    }

    public get city(): string {
        return this._city;
    }

    public set city(value: string) {
        this._city = value;
    }

    public get streetNumber(): string {
        return this._streetNumber;
    }

    public set streetNumber(value: string) {
        this._streetNumber = value;
    }

    public get controlCenterRelation(): ControlCenter {
        return this._controlCenterRelation;
    }

    public set controlCenterRelation(value: ControlCenter) {
        this._controlCenterRelation = value;
    }

    public get streetName(): string {
        return this._streetName;
    }

    public set streetName(value: string) {
        this._streetName = value;
    }

    public get patientName(): string {
        return this._patientName;
    }

    public set patientName(value: string) {
        this._patientName = value;
    }

    public get state(): EmergencyEnum {
        return this._state;
    }

    public set state(value: EmergencyEnum) {
        this._state = value;
    }

    public get configurationRelation(): Configuration {
        return this._configurationRelation;
    }

    public set configurationRelation(value: Configuration) {
        this._configurationRelation = value;
    }

    public get country(): string {
        return this._country;
    }

    public set country(value: string) {
        this._country = value;
    }

    public get NEFArrivalDate(): Date {
        return this._NEFArrivalDate;
    }

    public set NEFArrivalDate(value: Date) {
        this._NEFArrivalDate = value;
    }

    public get emergencyNumber(): number {
        return this._emergencyNumber;
    }

    public set emergencyNumber(value: number) {
        this._emergencyNumber = value;
    }

    public get emergencyNumberDC(): string {
        return this._emergencyNumberDC;
    }

    public set emergencyNumberDC(value: string) {
        this._emergencyNumberDC = value;
    }

    public get indicatorName(): string {
        return this._indicatorName;
    }

    public set indicatorName(value: string) {
        this._indicatorName = value;
    }

    public get locationPoint(): Parse.GeoPoint {
        return this._locationPoint;
    }

    public set locationPoint(value: Parse.GeoPoint) {
        this._locationPoint = value;
    }

    public setLocationPoint(latitude: number, longitude: number) {
        this._locationPoint = new Parse.GeoPoint(latitude, longitude);
    }

    public get informationString(): string {
        return this._informationString;
    }

    public set informationString(value: string) {
        this._informationString = value;
    }

    public get plz(): string {
        return this._plz;
    }

    public set plz(value: string) {
        this._plz = value;
    }

    public get allFRcontacted(): boolean {
        return this._allFRcontacted;
    }

    public set allFRcontacted(value: boolean) {
        this._allFRcontacted = value;
    }

    public get testEmergencySendBy(): User {
        return this._testEmergencySendBy;
    }

    public set testEmergencySendBy(value: User) {
        this._testEmergencySendBy = value;
    }

    public get emergencyStateArray(): Array<String> {
        return this._emergencyStateArray;
    }

    public set emergencyStateArray(value: Array<String>) {
        this._emergencyStateArray = value;
    }

    public get firstresponderAccepted(): boolean {
        return this._firstresponderAccepted;
    }

    public set firstresponderAccepted(value: boolean) {
        this._firstresponderAccepted = value;
    }

    public get involvedFR(): number {
        return this._involvedFR;
    }

    public set involvedFR(value: number) {
        this._involvedFR = value;
    }

    public get emergencyTask(): EmergencyTaskEnum {
        return this._emergencyTask;
    }

    public set emergencyTask(value: EmergencyTaskEnum) {
        this._emergencyTask = value;
    }
}

BaseModel.registerClass(Emergency, Emergency.PARSE_CLASSNAME);
