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

export enum DefibrillatorState {
  inApproval = 1,
  rejected = 2,
  available = 3,
  verified = 4,
}

export enum DefibrillatorProducerEnum {
  noInput = 0,
  Phillips = 1,
  Schiller = 2,
  GS = 3,
  Medtronic = 4,
  Marquette = 5,
  Zoll = 6,
  Primedic = 7,
  Draeger = 8,
  Weinmann = 9,
  WelchAllyn = 10,
  GE = 11,
  Defibtech = 12,
  notClassified = 99
}

export let DefibrillatorProducerEnumText = new Map<DefibrillatorProducerEnum, string>()
  .set(DefibrillatorProducerEnum.noInput, 'keine Angaben')
  .set(DefibrillatorProducerEnum.Phillips, 'Laerdal/Phillips/HP')
  .set(DefibrillatorProducerEnum.Schiller, 'Schiller/Bruker')
  .set(DefibrillatorProducerEnum.GS, 'GS Elektromedizinische Geräte')
  .set(DefibrillatorProducerEnum.Medtronic, 'Medtronic/Physio-Control')
  .set(DefibrillatorProducerEnum.Marquette, 'Marquette')
  .set(DefibrillatorProducerEnum.Zoll, 'Zoll')
  .set(DefibrillatorProducerEnum.Primedic, 'Primedic')
  .set(DefibrillatorProducerEnum.Draeger, 'Dräger')
  .set(DefibrillatorProducerEnum.Weinmann, 'Weinmann')
  .set(DefibrillatorProducerEnum.WelchAllyn, 'Welch Allyn')
  .set(DefibrillatorProducerEnum.GE, 'GE')
  .set(DefibrillatorProducerEnum.Defibtech, 'Defibtech')
  .set(DefibrillatorProducerEnum.notClassified, 'nicht klassifiziert');

export class Defibrillator extends BaseModel {
  public static PARSE_CLASSNAME = 'Defibrillator';

  private _activated: boolean;
  private _zip: string;
  private _status: string;
  private _street: string;
  private _number: string;
  private _city: string;
  private _creator: User;
  private _information: string;
  private _location: Parse.GeoPoint;
  private _files: Array<Parse.File>;
  private _object: string;
  private _state: DefibrillatorState;
  private _producerDefiValue: DefibrillatorProducerEnum;
  private _defiType: string;
  private _defiModel: string;
  private _company: string;
  private _monday: boolean;
  private _mo_open: string;
  private _mo_close: string;
  private _mo_and_open: string;
  private _mo_and_close: string;
  private _tuesday: boolean;
  private _tu_open: string;
  private _tu_close: string;
  private _tu_and_open: string;
  private _tu_and_close: string;
  private _wednesday: boolean;
  private _we_open: string;
  private _we_close: string;
  private _we_and_open: string;
  private _we_and_close: string;
  private _thursday: boolean;
  private _thu_open: string;
  private _thu_close: string;
  private _thu_and_open: string;
  private _thu_and_close: string;
  private _friday: boolean;
  private _fr_open: string;
  private _fr_close: string;
  private _fr_and_open: string;
  private _fr_and_close: string;
  private _saturday: boolean;
  private _sa_open: string;
  private _sa_close: string;
  private _sa_and_open: string;
  private _sa_and_close: string;
  private _sunday: boolean;
  private _su_open: string;
  private _su_close: string;
  private _su_and_open: string;
  private _su_and_close: string;
  private _eastermonday: boolean;
  private _eastermonday_open: string;
  private _eastermonday_close: string;
  private _eastermonday_and_open: string;
  private _eastermonday_and_close: string;
  private _easter: boolean;
  private _easter_open: string;
  private _easter_close: string;
  private _easter_and_open: string;
  private _easter_and_close: string;
  private _whitmonday: boolean;
  private _whitmonday_open: string;
  private _whitmonday_close: string;
  private _whitmonday_and_open: string;
  private _whitmonday_and_close: string;
  private _ascensionday: boolean;
  private _ascensionday_open: string;
  private _ascensionday_close: string;
  private _ascensionday_and_open: string;
  private _ascensionday_and_close: string;
  private _karfreitag: boolean;
  private _karfreitag_open: string;
  private _karfreitag_close: string;
  private _karfreitag_and_open: string;
  private _karfreitag_and_close: string;
  private _einheitstag: boolean;
  private _einheitstag_open: string;
  private _einheitstag_close: string;
  private _einheitstag_and_open: string;
  private _einheitstag_and_close: string;
  private _mayday: boolean;
  private _mayday_open: string;
  private _mayday_close: string;
  private _mayday_and_open: string;
  private _mayday_and_close: string;
  private _christmasdays: boolean;
  private _christmasdays_open: string;
  private _christmasdays_close: string;
  private _christmasdays_and_open: string;
  private _christmasdays_and_close: string;
  private _christmaseve: boolean;
  private _christmaseve_open: string;
  private _christmaseve_close: string;
  private _christmaseve_and_open: string;
  private _christmaseve_and_close: string;
  private _newyearseve: boolean;
  private _newyearseve_open: string;
  private _newyearseve_close: string;
  private _newyearseve_and_open: string;
  private _newyearseve_and_close: string;
  private _newyear: boolean;
  private _newyear_open: string;
  private _newyear_close: string;
  private _newyear_and_open: string;
  private _newyear_and_close: string;

  constructor() {
    super(Defibrillator.PARSE_CLASSNAME);
  }

  public get activated(): boolean {
    return this._activated;
  }

  public set activated(value: boolean) {
    this._activated = value;
  }

  public get zip(): string {
    return this._zip;
  }

  public set zip(value: string) {
    this._zip = value;
  }

  public get status(): string {
    return this._status;
  }

  public set status(value: string) {
    this._status = value;
  }

  public get street(): string {
    return this._street;
  }

  public set street(value: string) {
    this._street = value;
  }

  public get number(): string {
    return this._number;
  }

  public set number(value: string) {
    this._number = value;
  }

  public get city(): string {
    return this._city;
  }

  public set city(value: string) {
    this._city = value;
  }

  public get creator(): User {
    return this._creator;
  }

  public set creator(value: User) {
    this._creator = value;
  }

  public get information(): string {
    return this._information;
  }

  public set information(value: string) {
    this._information = value;
  }

  public get object(): string {
    return this._object;
  }

  public set object(value: string) {
    this._object = value;
  }

  public get location(): Parse.GeoPoint {
    return this._location;
  }

  public set location(value: Parse.GeoPoint) {
    this._location = value;
  }


  public get files(): Array<Parse.File> {
    return this._files;
  }

  public set files(value: Array<Parse.File>) {
    this._files = value;
  }

  public get state(): DefibrillatorState {
    return this._state;
  }

  public set state(value: DefibrillatorState) {
    this._state = value;
  }

  get defibrillatorProducer(): DefibrillatorProducerEnum {
    return this._producerDefiValue;
  }

  set defibrillatorProducer(value: DefibrillatorProducerEnum) {
    this._producerDefiValue = value;
  }

  get defiType(): string {
    return this._defiType;
  }

  set defiType(value: string) {
    this._defiType = value;
  }

  get defiModel(): string {
    return this._defiModel;
  }

  set defiModel(value: string) {
    this._defiModel = value;
  }

  get company(): string {
    return this._company;
  }

  set company(value: string) {
    this._company = value;
  }

  get monday(): boolean {
    return this._monday;
  }

  set monday(value: boolean) {
    this._monday = value;
  }

  get tuesday(): boolean {
    return this._tuesday;
  }

  set tuesday(value: boolean) {
    this._tuesday = value;
  }

  get wednesday(): boolean {
    return this._wednesday;
  }

  set wednesday(value: boolean) {
    this._wednesday = value;
  }

  get thursday(): boolean {
    return this._thursday;
  }

  set thursday(value: boolean) {
    this._thursday = value;
  }

  get friday(): boolean {
    return this._friday;
  }

  set friday(value: boolean) {
    this._friday = value;
  }

  get saturday(): boolean {
    return this._saturday;
  }

  set saturday(value: boolean) {
    this._saturday = value;
  }

  get sunday(): boolean {
    return this._sunday;
  }

  set sunday(value: boolean) {
    this._sunday = value;
  }

  get eastermonday(): boolean {
    return this._eastermonday;
  }

  set eastermonday(value: boolean) {
    this._eastermonday = value;
  }

  get eastermonday_open(): string {
    return this._eastermonday_open;
  }

  set eastermonday_open(value: string) {
    this._eastermonday_open = value;
  }

  get eastermonday_close(): string {
    return this._eastermonday_close;
  }

  set eastermonday_close(value: string) {
    this._eastermonday_close = value;
  }

  get eastermonday_and_open(): string {
    return this._eastermonday_and_open;
  }

  set eastermonday_and_open(value: string) {
    this._eastermonday_and_open = value;
  }

  get eastermonday_and_close(): string {
    return this._eastermonday_and_close;
  }

  set eastermonday_and_close(value: string) {
    this._eastermonday_and_close = value;
  }

  get easter(): boolean {
    return this._easter;
  }

  set easter(value: boolean) {
    this._easter = value;
  }

  get easter_open(): string {
    return this._easter_open;
  }

  set easter_open(value: string) {
    this._easter_open = value;
  }

  get easter_close(): string {
    return this._easter_close;
  }

  set easter_close(value: string) {
    this._easter_close = value;
  }

  get easter_and_open(): string {
    return this._easter_and_open;
  }

  set easter_and_open(value: string) {
    this._easter_and_open = value;
  }

  get easter_and_close(): string {
    return this._easter_and_close;
  }

  set easter_and_close(value: string) {
    this._easter_and_close = value;
  }

  get whitmonday(): boolean {
    return this._whitmonday;
  }

  set whitmonday(value: boolean) {
    this._whitmonday = value;
  }

  get whitmonday_open(): string {
    return this._whitmonday_open;
  }

  set whitmonday_open(value: string) {
    this._whitmonday_open = value;
  }

  get whitmonday_close(): string {
    return this._whitmonday_close;
  }

  set whitmonday_close(value: string) {
    this._whitmonday_close = value;
  }

  get whitmonday_and_open(): string {
    return this._whitmonday_and_open;
  }

  set whitmonday_and_open(value: string) {
    this._whitmonday_and_open = value;
  }

  get whitmonday_and_close(): string {
    return this._whitmonday_and_close;
  }

  set whitmonday_and_close(value: string) {
    this._whitmonday_and_close = value;
  }

  get ascensionday(): boolean {
    return this._ascensionday;
  }

  set ascensionday(value: boolean) {
    this._ascensionday = value;
  }

  get ascensionday_open(): string {
    return this._ascensionday_open;
  }

  set ascensionday_open(value: string) {
    this._ascensionday_open = value;
  }

  get ascensionday_close(): string {
    return this._ascensionday_close;
  }

  set ascensionday_close(value: string) {
    this._ascensionday_close = value;
  }

  get ascensionday_and_open(): string {
    return this._ascensionday_and_open;
  }

  set ascensionday_and_open(value: string) {
    this._ascensionday_and_open = value;
  }

  get ascensionday_and_close(): string {
    return this._ascensionday_and_close;
  }

  set ascensionday_and_close(value: string) {
    this._ascensionday_and_close = value;
  }

  get karfreitag(): boolean {
    return this._karfreitag;
  }

  set karfreitag(value: boolean) {
    this._karfreitag = value;
  }

  get karfreitag_open(): string {
    return this._karfreitag_open;
  }

  set karfreitag_open(value: string) {
    this._karfreitag_open = value;
  }

  get karfreitag_close(): string {
    return this._karfreitag_close;
  }

  set karfreitag_close(value: string) {
    this._karfreitag_close = value;
  }

  get karfreitag_and_open(): string {
    return this._karfreitag_and_open;
  }

  set karfreitag_and_open(value: string) {
    this._karfreitag_and_open = value;
  }

  get karfreitag_and_close(): string {
    return this._karfreitag_and_close;
  }

  set karfreitag_and_close(value: string) {
    this._karfreitag_and_close = value;
  }

  get einheitstag(): boolean {
    return this._einheitstag;
  }

  set einheitstag(value: boolean) {
    this._einheitstag = value;
  }

  get einheitstag_open(): string {
    return this._einheitstag_open;
  }

  set einheitstag_open(value: string) {
    this._einheitstag_open = value;
  }

  get einheitstag_close(): string {
    return this._einheitstag_close;
  }

  set einheitstag_close(value: string) {
    this._einheitstag_close = value;
  }

  get einheitstag_and_open(): string {
    return this._einheitstag_and_open;
  }

  set einheitstag_and_open(value: string) {
    this._einheitstag_and_open = value;
  }

  get einheitstag_and_close(): string {
    return this._einheitstag_and_close;
  }

  set einheitstag_and_close(value: string) {
    this._einheitstag_and_close = value;
  }

  get mayday(): boolean {
    return this._mayday;
  }

  set mayday(value: boolean) {
    this._mayday = value;
  }

  get mayday_open(): string {
    return this._mayday_open;
  }

  set mayday_open(value: string) {
    this._mayday_open = value;
  }

  get mayday_close(): string {
    return this._mayday_close;
  }

  set mayday_close(value: string) {
    this._mayday_close = value;
  }

  get mayday_and_open(): string {
    return this._mayday_and_open;
  }

  set mayday_and_open(value: string) {
    this._mayday_and_open = value;
  }

  get mayday_and_close(): string {
    return this._mayday_and_close;
  }

  set mayday_and_close(value: string) {
    this._mayday_and_close = value;
  }

  get christmasdays(): boolean {
    return this._christmasdays;
  }

  set christmasdays(value: boolean) {
    this._christmasdays = value;
  }

  get christmasdays_open(): string {
    return this._christmasdays_open;
  }

  set christmasdays_open(value: string) {
    this._christmasdays_open = value;
  }

  get christmasdays_close(): string {
    return this._christmasdays_close;
  }

  set christmasdays_close(value: string) {
    this._christmasdays_close = value;
  }

  get christmasdays_and_open(): string {
    return this._christmasdays_and_open;
  }

  set christmasdays_and_open(value: string) {
    this._christmasdays_and_open = value;
  }

  get christmasdays_and_close(): string {
    return this._christmasdays_and_close;
  }

  set christmasdays_and_close(value: string) {
    this._christmasdays_and_close = value;
  }

  get christmaseve(): boolean {
    return this._christmaseve;
  }

  set christmaseve(value: boolean) {
    this._christmaseve = value;
  }

  get christmaseve_open(): string {
    return this._christmaseve_open;
  }

  set christmaseve_open(value: string) {
    this._christmaseve_open = value;
  }

  get christmaseve_close(): string {
    return this._christmaseve_close;
  }

  set christmaseve_close(value: string) {
    this._christmaseve_close = value;
  }

  get christmaseve_and_open(): string {
    return this._christmaseve_and_open;
  }

  set christmaseve_and_open(value: string) {
    this._christmaseve_and_open = value;
  }

  get christmaseve_and_close(): string {
    return this._christmaseve_and_close;
  }

  set christmaseve_and_close(value: string) {
    this._christmaseve_and_close = value;
  }

  get newyearseve(): boolean {
    return this._newyearseve;
  }

  set newyearseve(value: boolean) {
    this._newyearseve = value;
  }

  get newyearseve_open(): string {
    return this._newyearseve_open;
  }

  set newyearseve_open(value: string) {
    this._newyearseve_open = value;
  }

  get newyearseve_close(): string {
    return this._newyearseve_close;
  }

  set newyearseve_close(value: string) {
    this._newyearseve_close = value;
  }

  get newyearseve_and_open(): string {
    return this._newyearseve_and_open;
  }

  set newyearseve_and_open(value: string) {
    this._newyearseve_and_open = value;
  }

  get newyearseve_and_close(): string {
    return this._newyearseve_and_close;
  }

  set newyearseve_and_close(value: string) {
    this._newyearseve_and_close = value;
  }

  get newyear(): boolean {
    return this._newyear;
  }

  set newyear(value: boolean) {
    this._newyear = value;
  }

  get newyear_open(): string {
    return this._newyear_open;
  }

  set newyear_open(value: string) {
    this._newyear_open = value;
  }

  get newyear_close(): string {
    return this._newyear_close;
  }

  set newyear_close(value: string) {
    this._newyear_close = value;
  }

  get newyear_and_open(): string {
    return this._newyear_and_open;
  }

  set newyear_and_open(value: string) {
    this._newyear_and_open = value;
  }

  get newyear_and_close(): string {
    return this._newyear_and_close;
  }

  set newyear_and_close(value: string) {
    this._newyear_and_close = value;
  }

  get mo_open(): string {
    return this._mo_open;
  }

  set mo_open(value: string) {
    this._mo_open = value;
  }

  get mo_close(): string {
    return this._mo_close;
  }

  set mo_close(value: string) {
    this._mo_close = value;
  }

  get mo_and_open(): string {
    return this._mo_and_open;
  }

  set mo_and_open(value: string) {
    this._mo_and_open = value;
  }

  get mo_and_close(): string {
    return this._mo_and_close;
  }

  set mo_and_close(value: string) {
    this._mo_and_close = value;
  }

  get tu_open(): string {
    return this._tu_open;
  }

  set tu_open(value: string) {
    this._tu_open = value;
  }

  get tu_close(): string {
    return this._tu_close;
  }

  set tu_close(value: string) {
    this._tu_close = value;
  }

  get tu_and_open(): string {
    return this._tu_and_open;
  }

  set tu_and_open(value: string) {
    this._tu_and_open = value;
  }

  get tu_and_close(): string {
    return this._tu_and_close;
  }

  set tu_and_close(value: string) {
    this._tu_and_close = value;
  }

  get we_open(): string {
    return this._we_open;
  }

  set we_open(value: string) {
    this._we_open = value;
  }

  get we_close(): string {
    return this._we_close;
  }

  set we_close(value: string) {
    this._we_close = value;
  }

  get we_and_open(): string {
    return this._we_and_open;
  }

  set we_and_open(value: string) {
    this._we_and_open = value;
  }

  get we_and_close(): string {
    return this._we_and_close;
  }

  set we_and_close(value: string) {
    this._we_and_close = value;
  }

  get thu_open(): string {
    return this._thu_open;
  }

  set thu_open(value: string) {
    this._thu_open = value;
  }

  get thu_close(): string {
    return this._thu_close;
  }

  set thu_close(value: string) {
    this._thu_close = value;
  }

  get thu_and_open(): string {
    return this._thu_and_open;
  }

  set thu_and_open(value: string) {
    this._thu_and_open = value;
  }

  get thu_and_close(): string {
    return this._thu_and_close;
  }

  set thu_and_close(value: string) {
    this._thu_and_close = value;
  }

  get fr_open(): string {
    return this._fr_open;
  }

  set fr_open(value: string) {
    this._fr_open = value;
  }

  get fr_close(): string {
    return this._fr_close;
  }

  set fr_close(value: string) {
    this._fr_close = value;
  }

  get fr_and_open(): string {
    return this._fr_and_open;
  }

  set fr_and_open(value: string) {
    this._fr_and_open = value;
  }

  get fr_and_close(): string {
    return this._fr_and_close;
  }

  set fr_and_close(value: string) {
    this._fr_and_close = value;
  }

  get sa_open(): string {
    return this._sa_open;
  }

  set sa_open(value: string) {
    this._sa_open = value;
  }

  get sa_close(): string {
    return this._sa_close;
  }

  set sa_close(value: string) {
    this._sa_close = value;
  }

  get sa_and_open(): string {
    return this._sa_and_open;
  }

  set sa_and_open(value: string) {
    this._sa_and_open = value;
  }

  get sa_and_close(): string {
    return this._sa_and_close;
  }

  set sa_and_close(value: string) {
    this._sa_and_close = value;
  }

  get su_open(): string {
    return this._su_open;
  }

  set su_open(value: string) {
    this._su_open = value;
  }

  get su_close(): string {
    return this._su_close;
  }

  set su_close(value: string) {
    this._su_close = value;
  }

  get su_and_open(): string {
    return this._su_and_open;
  }

  set su_and_open(value: string) {
    this._su_and_open = value;
  }

  get su_and_close(): string {
    return this._su_and_close;
  }

  set su_and_close(value: string) {
    this._su_and_close = value;
  }

  public getStateText(state?: DefibrillatorState): string {
    if (!state) {
      state = this.state;
    }
    if (state === DefibrillatorState.inApproval) {
      return 'In Überprüfung';
    } else if (state === DefibrillatorState.rejected) {
      return 'Abgelehnt';
    } else if (state === DefibrillatorState.available) {
      return 'Verfügbar';
    } else if (state === DefibrillatorState.verified) {
      return 'Verifiziert durch ASB';
    } else {
      return 'Kein Status definiert';
    }
  }

  public getStateIcon(state?: DefibrillatorState): string {
    if (!state) {
      state = this.state;
    }
    if (state === DefibrillatorState.inApproval) {
      return 'fa-search';
    } else if (state === DefibrillatorState.rejected) {
      return 'fa-ban';
    } else if (state === DefibrillatorState.available) {
      return 'fa-check';
    } else if (state === DefibrillatorState.verified) {
      return 'fa-check-circle';
    } else {
      return '';
    }
  }
}

BaseModel.registerClass(Defibrillator, Defibrillator.PARSE_CLASSNAME);
