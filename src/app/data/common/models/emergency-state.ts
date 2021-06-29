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
import { Emergency, EmergencyTaskEnum } from './emergency';
import { Protocol } from './protocol';
import { Installation } from './installation';
import { ControlCenter } from './control-center';

export enum EmergencyStateEnum {
    initial = 0,
    received = 1,
    ready = 2,
    accepted = 3,
    arrived = 4,
    aborted = 5,
    finished = 6,
    calledBack = 7,
    contacted = 8
}

export enum ProtocolStateEnum {
    none = 0,
    inProgress = 1,
    accepted = 2,
    cancelled = 3,
}

export class EmergencyState extends BaseModel {
    public static PARSE_CLASSNAME = 'EmergencyState';

    private _arrivedAt: Date;
    private _cancelledAt: Date;
    private _userQualification: string;
    private _userRelation: User;
    private _userProfession: string;
    private _endedAt: Date;
    private _emergencyRelation: Emergency;
    private _state: EmergencyStateEnum;
    private _contactedAt: Date;
    private _protocolRelation: Protocol;
    private _readyAt: Date;
    private _installationRelation: Installation;
    private _maxRadius: number;
    private _calledBackAt: Date;
    private _acceptedAt: Date;
    private _controlCenterRelation: ControlCenter;
    private _emergencyTask: EmergencyTaskEnum;

    constructor() {
        super(EmergencyState.PARSE_CLASSNAME);
    }

    public cancel(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            Parse.Cloud.run('cancelFirstResponder', { emergencyStateId: this.id }).then(result => resolve(result), error => reject(error));
        });
    }

    public pushMessage(title: string, message: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            Parse.Cloud.run('pushToFirstresponder', { installationId: this.installationRelation.id, alert: title, message: message, state: 2 }).then(result => resolve(result), error => reject(error));
        });
    }

    public get protocolState(): ProtocolStateEnum {
        if ((this.protocolRelation === undefined || this.protocolRelation.done !== true) && this.state !== EmergencyStateEnum.initial && this.state !== EmergencyStateEnum.ready && this.state !== EmergencyStateEnum.received) {
            return ProtocolStateEnum.inProgress;
        } else {
            if (this.protocolRelation !== undefined) {
                return (this.protocolRelation.cancelComment) ? ProtocolStateEnum.cancelled : ProtocolStateEnum.accepted;
            } else {
                return ProtocolStateEnum.none;
            }
        }
    }

    public get arrivedAt(): Date {
        return this._arrivedAt;
    }

    public set arrivedAt(value: Date) {
        this._arrivedAt = value;
    }

    public get cancelledAt(): Date {
        return this._cancelledAt;
    }

    public set cancelledAt(value: Date) {
        this._cancelledAt = value;
    }

    public get userQualification(): string {
        return this._userQualification;
    }

    public set userQualification(value: string) {
        this._userQualification = value;
    }

    public get userRelation(): User {
        return this._userRelation;
    }

    public set userRelation(value: User) {
        this._userRelation = value;
    }

    public get userProfession(): string {
        return this._userProfession;
    }

    public set userProfession(value: string) {
        this._userProfession = value;
    }

    public get endedAt(): Date {
        return this._endedAt;
    }

    public set endedAt(value: Date) {
        this._endedAt = value;
    }

    public get controlCenterRelation(): ControlCenter {
        return this._controlCenterRelation;
    }

    public set controlCenterRelation(value: ControlCenter) {
        this._controlCenterRelation = value;
    }

    public get emergencyRelation(): Emergency {
        return this._emergencyRelation;
    }

    public set emergencyRelation(value: Emergency) {
        this._emergencyRelation = value;
    }

    public get state(): EmergencyStateEnum {
        return this._state;
    }

    public set state(value: EmergencyStateEnum) {
        this._state = value;
    }

    public get contactedAt(): Date {
        return this._contactedAt;
    }

    public set contactedAt(value: Date) {
        this._contactedAt = value;
    }

    public get protocolRelation(): Protocol {
        return this._protocolRelation;
    }

    public set protocolRelation(value: Protocol) {
        this._protocolRelation = value;
    }

    public get readyAt(): Date {
        return this._readyAt;
    }

    public set readyAt(value: Date) {
        this._readyAt = value;
    }

    public get installationRelation(): Installation {
        return this._installationRelation;
    }

    public set installationRelation(value: Installation) {
        this._installationRelation = value;
    }

    public get maxRadius(): number {
        return this._maxRadius;
    }

    public set maxRadius(value: number) {
        this._maxRadius = value;
    }

    public get calledBackAt(): Date {
        return this._calledBackAt;
    }

    public set calledBackAt(value: Date) {
        this._calledBackAt = value;
    }

    public get acceptedAt(): Date {
        return this._acceptedAt;
    }

    public set acceptedAt(value: Date) {
        this._acceptedAt = value;
    }

    public get emergencyTask(): EmergencyTaskEnum {
        return this._emergencyTask;
    }

    public set emergencyTask(value: EmergencyTaskEnum) {
        this._emergencyTask = value;
    }
}

BaseModel.registerClass(EmergencyState, EmergencyState.PARSE_CLASSNAME);
