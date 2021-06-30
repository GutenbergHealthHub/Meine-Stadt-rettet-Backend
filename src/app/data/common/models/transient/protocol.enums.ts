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
 *
 * Here are enums for Protocol decisions listed. e.g. Patient-Sex categories, reasons for not performing cpr
 */

export enum ProtocolAgeCategoryEnum {
    oneToSevenDays = 1,
    eightToTwentyeightDays = 2,
    joungerThenOneYear = 3,
}

export const ProtocolAgeCategoryEnumText = new Map<ProtocolAgeCategoryEnum, string>()
    .set(ProtocolAgeCategoryEnum.oneToSevenDays, '1-7 Tage')
    .set(ProtocolAgeCategoryEnum.eightToTwentyeightDays, '8-28 Tage')
    .set(ProtocolAgeCategoryEnum.joungerThenOneYear, 'jünger als 1 Jahr');

export enum ProtocolSexEnum {
    male = 'm',
    female = 'w',
}

export const ProtocolSexEnumText = new Map<ProtocolSexEnum, string>()
    .set(ProtocolSexEnum.male, 'männlich')
    .set(ProtocolSexEnum.female, 'weiblich');

export enum ProtocolReanimationEnum {
    performed = 1,
    notPerformedPatientNotReachable = 2,
    notPerformedPhysicalCondition = 3,
    notPerformedOtherFactors = 4,
}

export const ProtocolReanimationEnumText = new Map<ProtocolReanimationEnum, string>()
    .set(ProtocolReanimationEnum.performed, 'Reanimation durchgeführt')
    .set(ProtocolReanimationEnum.notPerformedPatientNotReachable, 'nicht durchgeführt, da Patient nicht erreichbar')
    .set(
        ProtocolReanimationEnum.notPerformedPhysicalCondition,
        'nicht durchgeführt, da Reanimation körperlich nicht leistbar',
    )
    .set(ProtocolReanimationEnum.notPerformedOtherFactors, 'Reanimation nicht durchgeführt, andere Faktoren');

export enum ProtocolStartLocationEnum {
    notDocumented = 0,
    apartment = 1,
    nursingHome = 2,
    workplace = 3,
    doctorsOffice = 4,
    street = 5,
    public = 6,
    hospital = 7,
    massEvent = 8,
    others = 9,
    educationalInstitution = 10,
    sportsClub = 11,
    birthHouse = 12,
    unknown = 99,
}

export const ProtocolStartLocationEnumText = new Map<ProtocolStartLocationEnum, string>()
    .set(ProtocolStartLocationEnum.notDocumented, 'nicht dokumentiert')
    .set(ProtocolStartLocationEnum.apartment, 'Wohnung')
    .set(ProtocolStartLocationEnum.nursingHome, 'Altenheim')
    .set(ProtocolStartLocationEnum.workplace, 'Arbeitsplatz')
    .set(ProtocolStartLocationEnum.doctorsOffice, 'Arztpraxis')
    .set(ProtocolStartLocationEnum.street, 'Straße')
    .set(ProtocolStartLocationEnum.public, 'Öffentlicher Raum')
    .set(ProtocolStartLocationEnum.hospital, 'Krankenhaus')
    .set(ProtocolStartLocationEnum.massEvent, 'Massenveranstaltung')
    .set(ProtocolStartLocationEnum.others, 'Sonstiger Ort')
    .set(ProtocolStartLocationEnum.educationalInstitution, 'Bildungseinrichtung')
    .set(ProtocolStartLocationEnum.sportsClub, 'Sportstätte')
    .set(ProtocolStartLocationEnum.birthHouse, 'Geburtshaus/ -einrichtung')
    .set(ProtocolStartLocationEnum.unknown, 'nicht bekannt');

export enum ProtocolReactionEnum {
    notDocumented = 0,
    narcotized = 1,
    awake = 2,
    respondsToSpeech = 3,
    respondsToPain = 4,
    unconscious = 5,
    drowsy = 6,
    notAssessable = 99,
}

export const ProtocolReactionEnumText = new Map<ProtocolReactionEnum, string>()
    .set(ProtocolReactionEnum.notDocumented, 'nicht dokumentiert')
    .set(ProtocolReactionEnum.narcotized, 'analgosediert / Narkose')
    .set(ProtocolReactionEnum.awake, 'wach')
    .set(ProtocolReactionEnum.respondsToSpeech, 'reagiert auf Ansprache')
    .set(ProtocolReactionEnum.respondsToPain, 'reagiert auf Schmerzreiz')
    .set(ProtocolReactionEnum.unconscious, 'bewusstlos')
    .set(ProtocolReactionEnum.drowsy, 'schläfrig')
    .set(ProtocolReactionEnum.notAssessable, 'nicht beurteilbar');

export enum ProtocolStartRespirationEnum {
    noFindingDocumented = 0,
    gasping = 8,
    apnoe = 9,
    respiration = 10,
    normal = 11,
    notAssessable = 99,
}

export const ProtocolStartRespirationEnumText = new Map<ProtocolStartRespirationEnum, string>()
    .set(ProtocolStartRespirationEnum.noFindingDocumented, 'kein Befund dokumentiert')
    .set(ProtocolStartRespirationEnum.gasping, 'Schnappatmung')
    .set(ProtocolStartRespirationEnum.apnoe, 'Apnoe')
    .set(ProtocolStartRespirationEnum.respiration, 'Beatmung')
    .set(ProtocolStartRespirationEnum.normal, 'Normale Atmung')
    .set(ProtocolStartRespirationEnum.notAssessable, 'nicht beurteilbar');

export enum ProtocolStartDiagnoseEnum {
    cardial = 1,
    trauma = 2,
    drowning = 3,
    hypoxia = 4,
    intoxication = 5,
    icb_sab = 6,
    sids = 7,
    bleedToDeath = 8,
    stroke = 9,
    metabolic = 10,
    others = 11,
    sepsis = 12,
    unknown = 99,
}

export const ProtocolStartDiagnoseEnumText = new Map<ProtocolStartDiagnoseEnum, string>()
    .set(ProtocolStartDiagnoseEnum.cardial, 'kardial')
    .set(ProtocolStartDiagnoseEnum.trauma, 'Trauma')
    .set(ProtocolStartDiagnoseEnum.drowning, 'Ertrinken')
    .set(ProtocolStartDiagnoseEnum.hypoxia, 'Hypoxie')
    .set(ProtocolStartDiagnoseEnum.intoxication, 'Intoxikation')
    .set(ProtocolStartDiagnoseEnum.icb_sab, 'ICB / SAB')
    .set(ProtocolStartDiagnoseEnum.sids, 'SIDS')
    .set(ProtocolStartDiagnoseEnum.bleedToDeath, 'Verbluten')
    .set(ProtocolStartDiagnoseEnum.stroke, 'Stroke')
    .set(ProtocolStartDiagnoseEnum.metabolic, 'metabolisch')
    .set(ProtocolStartDiagnoseEnum.others, 'Sonstiges')
    .set(ProtocolStartDiagnoseEnum.sepsis, 'Sepsis')
    .set(ProtocolStartDiagnoseEnum.unknown, 'nicht bekannt');

export enum ProtocolStartOrientationEnum {
    normal = 1,
    limitedOriented = 2,
    disoriented = 3,
    unknown = 99,
}

export const ProtocolStartOrientationEnumText = new Map<ProtocolStartOrientationEnum, string>()
    .set(ProtocolStartOrientationEnum.normal, 'Normal')
    .set(ProtocolStartOrientationEnum.limitedOriented, 'Eingeschränkt')
    .set(ProtocolStartOrientationEnum.disoriented, 'Desorientiert')
    .set(ProtocolStartOrientationEnum.unknown, 'nicht bekannt');

export enum ProtocolMeasureExecutorEnum {
    accidentallyPresentWittness = 1,
    appFirstResponder = 2,
    notObserved = 3,
    notSpecifiedOrPatientNotReanimated = 98,
}

export const ProtocolMeasureExecutorEnumText = new Map<ProtocolMeasureExecutorEnum, string>()
    .set(ProtocolMeasureExecutorEnum.accidentallyPresentWittness, 'zufällig anwesender Zeuge')
    .set(ProtocolMeasureExecutorEnum.appFirstResponder, 'App-Helfer')
    .set(ProtocolMeasureExecutorEnum.notObserved, 'nicht beobachtet')
    .set(ProtocolMeasureExecutorEnum.notSpecifiedOrPatientNotReanimated, 'keine Angabe, Patient nicht reanimiert');

export enum ProtocolMeasureDefiShockEnum {
    notSpecified = 0,
    oneShock = 1,
    twoToThreeShocks = 2,
    fourToSixShocks = 3,
    sevenToNineShocks = 4,
    moreThanNineShocks = 5,
    unknown = 99,
}

export const ProtocolMeasureDefiShockEnumText = new Map<ProtocolMeasureDefiShockEnum, string>()
    .set(ProtocolMeasureDefiShockEnum.notSpecified, 'keine Angaben')
    .set(ProtocolMeasureDefiShockEnum.oneShock, '1 Schock')
    .set(ProtocolMeasureDefiShockEnum.twoToThreeShocks, '2-3 Schocks')
    .set(ProtocolMeasureDefiShockEnum.fourToSixShocks, '4-6 Schocks')
    .set(ProtocolMeasureDefiShockEnum.sevenToNineShocks, '7-9 Schocks')
    .set(ProtocolMeasureDefiShockEnum.moreThanNineShocks, 'mehr als 9 Schocks')
    .set(ProtocolMeasureDefiShockEnum.unknown, 'nicht klassifiziert');

export enum ProtocolProducerDefiEnum {
    notSpecified = 0,
    laerdal_phillips_hp = 1,
    schiller_bruker = 2,
    gsElektromedizinischeGeraete = 3,
    medtronic_physioControl = 4,
    marquette = 5,
    zoll = 6,
    primedic = 7,
    draeger = 8,
    weinmann = 9,
    welchAllyn = 10,
    ge = 11,
    defibtech = 12,
    unknown = 99,
}

export const ProtocolProducerDefiEnumText = new Map<ProtocolProducerDefiEnum, string>()
    .set(ProtocolProducerDefiEnum.notSpecified, 'keine Angaben')
    .set(ProtocolProducerDefiEnum.laerdal_phillips_hp, 'Laerdal/Phillips/HP')
    .set(ProtocolProducerDefiEnum.schiller_bruker, 'Schiller/Bruker')
    .set(ProtocolProducerDefiEnum.gsElektromedizinischeGeraete, 'GS Elektromedizinische Geräte')
    .set(ProtocolProducerDefiEnum.medtronic_physioControl, 'Medtronic/Physio-Control')
    .set(ProtocolProducerDefiEnum.marquette, 'Marquette')
    .set(ProtocolProducerDefiEnum.zoll, 'Zoll')
    .set(ProtocolProducerDefiEnum.primedic, 'Primedic')
    .set(ProtocolProducerDefiEnum.draeger, 'Dräger')
    .set(ProtocolProducerDefiEnum.weinmann, 'Weinmann')
    .set(ProtocolProducerDefiEnum.welchAllyn, 'Welch Allyn')
    .set(ProtocolProducerDefiEnum.ge, 'GE')
    .set(ProtocolProducerDefiEnum.defibtech, 'Defibtech')
    .set(ProtocolProducerDefiEnum.unknown, 'nicht klassifiziert');

export enum ProtocolEndRespirationEnum {
    runningReanimation = 1,
    normalBreathing = 2,
    patientIsConscious = 3,
}

export const ProtocolEndRespirationEnumText = new Map<ProtocolEndRespirationEnum, string>()
    .set(ProtocolEndRespirationEnum.runningReanimation, 'laufende Reanimation')
    .set(ProtocolEndRespirationEnum.normalBreathing, 'Atmung vorhanden')
    .set(ProtocolEndRespirationEnum.patientIsConscious, 'Patient bei Bewußtsein');
