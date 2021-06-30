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
 * Enums for provider qualification with corresponding id. e.g. 'Rettungssanitäter' maps to 3
 */

export enum UserQualificationEnum {
    BLSTraining = 1,
    EHCourse = 2,
    paramedic = 3,
    criticalCareParamedic = 4,
    doctor = 5,
    doctorWithLabelEmergencyMedicine = 6,
    trainingAsParamedic = 7,
    ambulanceMan = 8,
}

export const UserQualificationEnumText = new Map<UserQualificationEnum, string>()
    .set(UserQualificationEnum.BLSTraining, 'BLS-Schulung')
    .set(UserQualificationEnum.EHCourse, 'EH-Kurs')
    .set(UserQualificationEnum.paramedic, 'Rettungssanitäter')
    .set(UserQualificationEnum.criticalCareParamedic, 'Rettungsassistent/Notfallsanitäter')
    .set(UserQualificationEnum.doctor, 'Arzt')
    .set(UserQualificationEnum.doctorWithLabelEmergencyMedicine, 'Arzt mit Zusatzbezeichnung Notfallmedizin')
    .set(UserQualificationEnum.trainingAsParamedic, 'Sanitätsausbildung')
    .set(UserQualificationEnum.ambulanceMan, 'Rettungshelfer');

export enum UserProfessionEnum {
    elderCare = 1,
    doctor = 2,
    doctorWithoutTechnicalKnowledge = 3,
    doctorsAssistant = 4,
    companyParamedic = 5,
    fireChief = 6,
    germanArmedForce = 7,
    fireDepartment = 8,
    volunteerFireDepartment = 9,
    aidAgency = 10,
    intensiveAnaesthesiaNursing = 11,
    nursing = 12,
    medicalStudent = 13,
    emergencyDoctor = 14,
    policeman = 15,
    paramedicAssistent = 16,
    paramedic = 17,
    ambulanceMan = 18,
    medic = 19,
    other = 20,
    otherWithMedicalBackground = 21,
    THW = 22,
}

export const UserProfessionEnumText = new Map<UserProfessionEnum, string>()
    .set(UserProfessionEnum.elderCare, 'Altenpflege')
    .set(UserProfessionEnum.doctor, 'Arzt')
    .set(UserProfessionEnum.doctorWithoutTechnicalKnowledge, 'Arzt (ohne Fachkunde/RD)')
    .set(UserProfessionEnum.doctorsAssistant, 'Arzthelfer')
    .set(UserProfessionEnum.companyParamedic, 'Betriebssanitäter')
    .set(UserProfessionEnum.fireChief, 'Brandmeister')
    .set(UserProfessionEnum.germanArmedForce, 'Bundeswehr')
    .set(UserProfessionEnum.fireDepartment, 'Feuerwehr (Beruflich)')
    .set(UserProfessionEnum.volunteerFireDepartment, 'Feuerwehr (Freiwillig)')
    .set(UserProfessionEnum.aidAgency, 'Hilfsorganisation')
    .set(UserProfessionEnum.intensiveAnaesthesiaNursing, 'Intensiv-Anästhesiepflege')
    .set(UserProfessionEnum.nursing, 'Krankenpflege')
    .set(UserProfessionEnum.medicalStudent, 'Medizinstudent')
    .set(UserProfessionEnum.emergencyDoctor, 'Notarzt')
    .set(UserProfessionEnum.policeman, 'Polizist')
    .set(UserProfessionEnum.paramedicAssistent, 'Rettungsassistent')
    .set(UserProfessionEnum.paramedic, 'Rettungssanitäter')
    .set(UserProfessionEnum.ambulanceMan, 'Rettungshelfer')
    .set(UserProfessionEnum.medic, 'Sanitäter')
    .set(UserProfessionEnum.other, 'Sonstige')
    .set(UserProfessionEnum.otherWithMedicalBackground, 'Sonstige mit medizinischem Hintergrund')
    .set(UserProfessionEnum.THW, 'THW');
