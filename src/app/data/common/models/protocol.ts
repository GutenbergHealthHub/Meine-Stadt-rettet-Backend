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
import {
    ProtocolAgeCategoryEnum,
    ProtocolSexEnum,
    ProtocolReanimationEnum,
    ProtocolStartLocationEnum,
    ProtocolReactionEnum,
    ProtocolStartRespirationEnum,
    ProtocolStartDiagnoseEnum,
    ProtocolStartOrientationEnum,
    ProtocolMeasureExecutorEnum,
    ProtocolMeasureDefiShockEnum,
    ProtocolProducerDefiEnum,
    ProtocolEndRespirationEnum,
    ProtocolAgeCategoryEnumText,
    ProtocolSexEnumText,
    ProtocolReanimationEnumText,
    ProtocolStartLocationEnumText,
    ProtocolReactionEnumText,
    ProtocolStartRespirationEnumText,
    ProtocolStartDiagnoseEnumText,
    ProtocolStartOrientationEnumText,
    ProtocolMeasureExecutorEnumText,
    ProtocolMeasureDefiShockEnumText,
    ProtocolProducerDefiEnumText,
    ProtocolEndRespirationEnumText,
} from './transient';

export class Protocol extends BaseModel {
    public static PARSE_CLASSNAME = 'Protocol';
    private _startLaterRelAmbulance: boolean;
    private _startMinutesRelAmbulance: number;
    private _age: number;
    private _ageCategory: ProtocolAgeCategoryEnum;
    private _sex: ProtocolSexEnum;
    private _reanimationValue: ProtocolReanimationEnum;
    private _startLocationValueN: ProtocolStartLocationEnum;
    private _schoolBuilding: boolean;
    private _startReactionValue: Array<ProtocolReactionEnum>;
    private _startRespirationValue: Array<ProtocolStartRespirationEnum>;
    private _startDiagnoseValue: Array<ProtocolStartDiagnoseEnum>;
    private _startOrientationValueN: ProtocolStartOrientationEnum;
    private _relationWithSport: boolean;
    private _collapseObserved: ProtocolMeasureExecutorEnum;
    private _measureChestCompressionValueN: ProtocolMeasureExecutorEnum;
    private _measureRespirationValue: ProtocolMeasureExecutorEnum;
    private _telemedicin: boolean;
    private _measureDefiValueN: ProtocolMeasureExecutorEnum;
    private _measureDefiShockCount: ProtocolMeasureDefiShockEnum;
    private _producerDefiValue: ProtocolProducerDefiEnum;
    private _codeDefiValue: number;
    private _publicDefi: boolean;
    private _endStatusA: Array<ProtocolReactionEnum>;
    private _endRespirationValue: Array<ProtocolEndRespirationEnum>;
    private _endComment: string;
    private _userbasedDataRemoved: boolean;
    private _callDiagnose: string;
    private _callErgonomie: string;
    private _callUserCondition: string;
    private _callOthers: string;

    // Not confirmed attributes
    private _cancelComment: string;
    private _done: boolean;

    constructor() {
        super(Protocol.PARSE_CLASSNAME);
    }

    /**
     * Getter startLaterRelAmbulance
     * @return {boolean}
     */
    public get startLaterRelAmbulance(): boolean {
        return this._startLaterRelAmbulance;
    }

    /**
     * Setter startLaterRelAmbulance
     * @param {boolean} value
     */
    public set startLaterRelAmbulance(value: boolean) {
        this._startLaterRelAmbulance = value;
    }

    /**
     * Getter startMinutesRelAmbulance
     * @return {number}
     */
    public get startMinutesRelAmbulance(): number {
        return this._startMinutesRelAmbulance;
    }

    /**
     * Setter startMinutesRelAmbulance
     * @param {number} value
     */
    public set startMinutesRelAmbulance(value: number) {
        this._startMinutesRelAmbulance = value;
    }

    /**
     * Getter age
     * @return {number}
     */
    public get age(): number {
        return this._age;
    }

    /**
     * Setter age
     * @param {number} value
     */
    public set age(value: number) {
        this._age = value;
    }

    /**
     * Getter ageCategory
     * @return {ProtocolAgeCategoryEnum}
     */
    public get ageCategory(): ProtocolAgeCategoryEnum {
        return this._ageCategory;
    }

    /**
     * Setter ageCategory
     * @param {ProtocolAgeCategoryEnum} value
     */
    public set ageCategory(value: ProtocolAgeCategoryEnum) {
        this._ageCategory = value;
    }

    public get ageCategoryText(): string {
        return ProtocolAgeCategoryEnumText.get(this.ageCategory);
    }

    /**
     * Getter sex
     * @return {ProtocolSexEnum}
     */
    public get sex(): ProtocolSexEnum {
        return this._sex;
    }

    /**
     * Setter sex
     * @param {ProtocolSexEnum} value
     */
    public set sex(value: ProtocolSexEnum) {
        this._sex = value;
    }

    public get sexText(): string {
        return ProtocolSexEnumText.get(this.sex);
    }

    /**
     * Setter reanimationValue
     * @param {ProtocolReanimationEnum} value
     */
    public set reanimationValue(value: ProtocolReanimationEnum) {
        this._reanimationValue = value;
    }

    /**
     * Getter reanimationValue
     * @return {ProtocolReanimationEnum}
     */
    public get reanimationValue(): ProtocolReanimationEnum {
        return this._reanimationValue;
    }

    /**
     * Getter startLocationValueN
     * @return {ProtocolStartLocationEnum}
     */
    public get startLocationValueN(): ProtocolStartLocationEnum {
        return this._startLocationValueN;
    }

    /**
     * Setter startLocationValueN
     * @param {ProtocolStartLocationEnum} value
     */
    public set startLocationValueN(value: ProtocolStartLocationEnum) {
        this._startLocationValueN = value;
    }

    public get reanimationText(): string {
        return ProtocolReanimationEnumText.get(this.reanimationValue);
    }

    public get startLocationText(): string {
        return ProtocolStartLocationEnumText.get(this.startLocationValueN);
    }

    /**
     * Getter schoolBuilding
     * @return {boolean}
     */
    public get schoolBuilding(): boolean {
        return this._schoolBuilding;
    }

    /**
     * Getter startReactionValue
     * @return {Array<ProtocolReactionEnum>}
     */
    public get startReactionValue(): Array<ProtocolReactionEnum> {
        return this._startReactionValue;
    }

    /**
     * Setter startReactionValue
     * @param {Array<ProtocolReactionEnum>} value
     */
    public set startReactionValue(value: Array<ProtocolReactionEnum>) {
        this._startReactionValue = value;
    }

    public get startReactionText(): string {
        const texts = new Array<string>();
        if (this.startReactionValue) {
            for (const enumValue of this.startReactionValue) {
                texts.push(ProtocolReactionEnumText.get(enumValue));
            }
        }
        return texts.join(', ');
    }

    /**
     * Getter startRespirationValue
     * @return {Array<ProtocolStartRespirationEnum>}
     */
    public get startRespirationValue(): Array<ProtocolStartRespirationEnum> {
        return this._startRespirationValue;
    }

    /**
     * Setter startRespirationValue
     * @param {Array<ProtocolStartRespirationEnum>} value
     */
    public set startRespirationValue(value: Array<ProtocolStartRespirationEnum>) {
        this._startRespirationValue = value;
    }

    public get startRespirationText(): string {
        const texts = new Array<string>();
        if (this.startRespirationValue) {
            for (const enumValue of this.startRespirationValue) {
                texts.push(ProtocolStartRespirationEnumText.get(enumValue));
            }
        }
        return texts.join(', ');
    }

    /**
     * Getter startDiagnoseValue
     * @return {Array<ProtocolStartDiagnoseEnum>}
     */
    public get startDiagnoseValue(): Array<ProtocolStartDiagnoseEnum> {
        return this._startDiagnoseValue;
    }

    /**
     * Setter startDiagnoseValue
     * @param {Array<ProtocolStartDiagnoseEnum>} value
     */
    public set startDiagnoseValue(value: Array<ProtocolStartDiagnoseEnum>) {
        this._startDiagnoseValue = value;
    }

    public get startDiagnoseText(): string {
        const texts = new Array<string>();
        if (this.startDiagnoseValue) {
            for (const enumValue of this.startDiagnoseValue) {
                texts.push(ProtocolStartDiagnoseEnumText.get(enumValue));
            }
        }
        return texts.join(', ');
    }

    /**
     * Getter startOrientationValueN
     * @return {ProtocolStartOrientationEnum}
     */
    public get startOrientationValueN(): ProtocolStartOrientationEnum {
        return this._startOrientationValueN;
    }

    /**
     * Setter startOrientationValueN
     * @param {ProtocolStartOrientationEnum} value
     */
    public set startOrientationValueN(value: ProtocolStartOrientationEnum) {
        this._startOrientationValueN = value;
    }

    public get startOrientationText(): string {
        return ProtocolStartOrientationEnumText.get(this.startOrientationValueN);
    }

    /**
     * Getter relationWithSport
     * @return {boolean}
     */
    public get relationWithSport(): boolean {
        return this._relationWithSport;
    }

    /**
     * Setter relationWithSport
     * @param {boolean} value
     */
    public set relationWithSport(value: boolean) {
        this._relationWithSport = value;
    }

    /**
     * Getter collapseObserved
     * @return {ProtocolMeasureExecutorEnum}
     */
    public get collapseObserved(): ProtocolMeasureExecutorEnum {
        return this._collapseObserved;
    }

    /**
     * Setter collapseObserved
     * @param {ProtocolMeasureExecutorEnum} value
     */
    public set collapseObserved(value: ProtocolMeasureExecutorEnum) {
        this._collapseObserved = value;
    }

    public get collapseObservedText(): string {
        return ProtocolMeasureExecutorEnumText.get(this.collapseObserved);
    }

    /**
     * Getter measureChestCompressionValueN
     * @return {ProtocolMeasureExecutorEnum}
     */
    public get measureChestCompressionValueN(): ProtocolMeasureExecutorEnum {
        return this._measureChestCompressionValueN;
    }

    /**
     * Setter measureChestCompressionValueN
     * @param {ProtocolMeasureExecutorEnum} value
     */
    public set measureChestCompressionValueN(value: ProtocolMeasureExecutorEnum) {
        this._measureChestCompressionValueN = value;
    }

    public get measureChestCompressionText(): string {
        return ProtocolMeasureExecutorEnumText.get(this.measureChestCompressionValueN);
    }

    /**
     * Getter measureRespirationValue
     * @return {ProtocolMeasureExecutorEnum}
     */
    public get measureRespirationValue(): ProtocolMeasureExecutorEnum {
        return this._measureRespirationValue;
    }

    /**
     * Setter measureRespirationValue
     * @param {ProtocolMeasureExecutorEnum} value
     */
    public set measureRespirationValue(value: ProtocolMeasureExecutorEnum) {
        this._measureRespirationValue = value;
    }

    public get measureRespirationText(): string {
        return ProtocolMeasureExecutorEnumText.get(this.measureRespirationValue);
    }

    /**
     * Getter telemedicin
     * @return {boolean}
     */
    public get telemedicin(): boolean {
        return this._telemedicin;
    }

    /**
     * Setter telemedicin
     * @param {boolean} value
     */
    public set telemedicin(value: boolean) {
        this._telemedicin = value;
    }

    /**
     * Getter measureDefiValueN
     * @return {ProtocolMeasureExecutorEnum}
     */
    public get measureDefiValueN(): ProtocolMeasureExecutorEnum {
        return this._measureDefiValueN;
    }

    /**
     * Setter measureDefiValueN
     * @param {ProtocolMeasureExecutorEnum} value
     */
    public set measureDefiValueN(value: ProtocolMeasureExecutorEnum) {
        this._measureDefiValueN = value;
    }

    public get measureDefiText(): string {
        return ProtocolMeasureExecutorEnumText.get(this.measureDefiValueN);
    }

    /**
     * Getter measureDefiShockCount
     * @return {ProtocolMeasureDefiShockEnum}
     */
    public get measureDefiShockCount(): ProtocolMeasureDefiShockEnum {
        return this._measureDefiShockCount;
    }

    /**
     * Setter measureDefiShockCount
     * @param {ProtocolMeasureDefiShockEnum} value
     */
    public set measureDefiShockCount(value: ProtocolMeasureDefiShockEnum) {
        this._measureDefiShockCount = value;
    }

    public get measureDefiShockCountText(): string {
        return ProtocolMeasureDefiShockEnumText.get(this.measureDefiShockCount);
    }

    /**
     * Getter producerDefiValue
     * @return {ProtocolProducerDefiEnum}
     */
    public get producerDefiValue(): ProtocolProducerDefiEnum {
        return this._producerDefiValue;
    }

    /**
     * Setter producerDefiValue
     * @param {ProtocolProducerDefiEnum} value
     */
    public set producerDefiValue(value: ProtocolProducerDefiEnum) {
        this._producerDefiValue = value;
    }

    public get producerDefiText(): string {
        return ProtocolProducerDefiEnumText.get(this.producerDefiValue);
    }

    /**
     * Getter codeDefiValue
     * @return {number}
     */
    public get codeDefiValue(): number {
        return this._codeDefiValue;
    }

    /**
     * Setter codeDefiValue
     * @param {number} value
     */
    public set codeDefiValue(value: number) {
        this._codeDefiValue = value;
    }

    /**
     * Getter publicDefi
     * @return {boolean}
     */
    public get publicDefi(): boolean {
        return this._publicDefi;
    }

    /**
     * Setter publicDefi
     * @param {boolean} value
     */
    public set publicDefi(value: boolean) {
        this._publicDefi = value;
    }

    /**
     * Getter endStatusA
     * @return {Array<ProtocolReactionEnum>}
     */
    public get endStatusA(): Array<ProtocolReactionEnum> {
        return this._endStatusA;
    }

    /**
     * Setter endStatusA
     * @param {Array<ProtocolReactionEnum>} value
     */
    public set endStatusA(value: Array<ProtocolReactionEnum>) {
        this._endStatusA = value;
    }

    public get endStatusAText(): string {
        const texts = new Array<string>();
        if (this.endStatusA) {
            for (const enumValue of this.endStatusA) {
                texts.push(ProtocolReactionEnumText.get(enumValue));
            }
        }
        return texts.join(', ');
    }

    /**
     * Getter endRespirationValue
     * @return {Array<ProtocolEndRespirationEnum>}
     */
    public get endRespirationValue(): Array<ProtocolEndRespirationEnum> {
        return this._endRespirationValue;
    }

    /**
     * Setter endRespirationValue
     * @param {Array<ProtocolEndRespirationEnum>} value
     */
    public set endRespirationValue(value: Array<ProtocolEndRespirationEnum>) {
        this._endRespirationValue = value;
    }

    public get endRespirationText(): string {
        const texts = new Array<string>();
        if (this.endRespirationValue) {
            for (const enumValue of this.endRespirationValue) {
                texts.push(ProtocolEndRespirationEnumText.get(enumValue));
            }
        }
        return texts.join(', ');
    }

    /**
     * Getter endComment
     * @return {string}
     */
    public get endComment(): string {
        return this._endComment;
    }

    /**
     * Setter endComment
     * @param {string} value
     */
    public set endComment(value: string) {
        this._endComment = value;
    }

    /**
     * Getter cancelComment
     * @return {string}
     */
    public get cancelComment(): string {
        return this._cancelComment;
    }
    /**
     * Setter cancelComment
     * @param {string} value
     */
    public set cancelComment(value: string) {
        this._cancelComment = value;
    }

    /**
     * Getter done
     * @return {boolean}
     */
    public get done(): boolean {
        return this._done;
    }

    /**
     * Setter done
     * @param {boolean} value
     */
    public set done(value: boolean) {
        this._done = value;
    }

    /**
     * Getter userbasedDataRemoved
     * @return {boolean}
     */
    public get userbasedDataRemoved(): boolean {
        return this._userbasedDataRemoved;
    }

    /**
     * Setter userbasedDataRemoved
     * @param {boolean} value
     */
    public set userbasedDataRemoved(value: boolean) {
        this._userbasedDataRemoved = value;
    }

    /**
     * Getter callDiagnose
     * @return {string}
     */
    public get callDiagnose(): string {
        return this._callDiagnose;
    }

    /**
     * Setter callDiagnose
     * @param {string} value
     */
    public set callDiagnose(value: string) {
        this._callDiagnose = value;
    }

    /**
     * Getter callErgonomie
     * @return {string}
     */
    public get callErgonomie(): string {
        return this._callErgonomie;
    }

    /**
     * Setter callErgonomie
     * @param {string} value
     */
    public set callErgonomie(value: string) {
        this._callErgonomie = value;
    }

    /**
     * Getter callUserCondition
     * @return {string}
     */
    public get callUserCondition(): string {
        return this._callUserCondition;
    }

    /**
     * Setter callUserCondition
     * @param {string} value
     */
    public set callUserCondition(value: string) {
        this._callUserCondition = value;
    }

    /**
     * Getter callOthers
     * @return {string}
     */
    public get callOthers(): string {
        return this._callOthers;
    }

    /**
     * Setter callOthers
     * @param {string} value
     */
    public set callOthers(value: string) {
        this._callOthers = value;
    }
}

BaseModel.registerClass(Protocol, Protocol.PARSE_CLASSNAME);
