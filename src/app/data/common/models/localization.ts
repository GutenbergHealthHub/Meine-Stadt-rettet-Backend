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

export enum LOCALIZATION {
    ENGLISH = 'en-EN',
    GERMAN = 'de-DE'
}

export class Localization {
    private readonly identifier: string;

    constructor(identifier: string) {
        this.identifier = identifier;
    }

    public informationString(): string {
        switch (this.identifier) {
            case LOCALIZATION.ENGLISH:
                return 'This is a manually generated test alarm. If you find any errors in the App, please contact us at info@meinestadtrettet.de';
            case LOCALIZATION.GERMAN:
                return 'Das ist ein manuell erstellter Probealarm. Sollten Sie Fehler in der Alarmierung finden, dann schreiben Sie uns bitte unter info@meinestadtrettet.de';
            default:
                return 'This is a manually generated test alarm. If you find any errors in the App, please contact us at info@meinestadtrettet.de';
        }
    }

    public objectName(): string {
        switch (this.identifier) {
            case LOCALIZATION.ENGLISH:
                return 'Test Alarm. NO Emergency!';
            case LOCALIZATION.GERMAN:
                return 'Test Alarm. KEIN Einsatz!';
            default:
                return 'Test Alarm. NO Emergency!';
        }
    }

    public keyword(): string {
        switch (this.identifier) {
            case LOCALIZATION.ENGLISH:
                return 'Reanimation';
            case LOCALIZATION.GERMAN:
                return 'Reanimation';
            default:
                return 'Reanimation';
        }
    }

    public patientName(): string {
        switch (this.identifier) {
            case LOCALIZATION.ENGLISH:
                return 'John Needhelp';
            case LOCALIZATION.GERMAN:
                return 'Ralf Innot';
            default:
                return 'John Needhelp';
        }
    }

    public indicatorName(): string {
        switch (this.identifier) {
            case LOCALIZATION.ENGLISH:
                return 'Jennifer Witness';
            case LOCALIZATION.GERMAN:
                return 'Petra Zeuge';
            default:
                return 'Jennifer Witness';
        }
    }

    public country(): string {
        switch (this.identifier) {
            case LOCALIZATION.ENGLISH:
                return 'Germany';
            case LOCALIZATION.GERMAN:
                return 'Deutschland';
            default:
                return 'Germany';
        }
    }

    public alert(): string {
        switch (this.identifier) {
            case LOCALIZATION.ENGLISH:
                return 'Emergency nearby!';
            case LOCALIZATION.GERMAN:
                return 'Potentieller Notfall in Ihrer Nähe!';
            default:
                return 'Emergency nearby!';
        }
    }

    public weeklyAlert(): string {
        switch (this.identifier) {
            case LOCALIZATION.ENGLISH:
                return 'Weekly Test Alarm';
            case LOCALIZATION.GERMAN:
                return 'Wöchentlicher Probealarm';
            default:
                return 'Weekly Test Alarm';
        }
    }

}
