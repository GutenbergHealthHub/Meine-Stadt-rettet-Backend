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

import { Injectable } from '@angular/core';
import { ErrorService, ParseService, Parse } from '../services';
import { Certificate } from '../models';

@Injectable()
export class CertificateService {

    constructor(private errorService: ErrorService, private parseService: ParseService) {
    }

    public getMain(): Promise<Certificate[]> {
        return new Promise<Certificate[]>((resolve, reject) => {
            const query = new Parse.Query(Certificate);
            query.equalTo('type', 1);
            query.find().then(certificates => resolve(certificates), error => this.errorService.handleParseErrors(error));
        });
    }

    public getOptional(): Promise<Certificate[]> {
        return new Promise<Certificate[]>((resolve, reject) => {
            const query = new Parse.Query(Certificate);
            query.equalTo('type', 0);
            query.find().then(certificates => resolve(certificates), error => this.errorService.handleParseErrors(error));
        });
    }

    public getById(id: string): Promise<Certificate> {
        return new Promise<Certificate>((resolve, reject) => {
            const query = new Parse.Query(Certificate);
            query.equalTo('objectId', id);
            query.first().then(certificate => resolve(certificate), error => this.errorService.handleParseErrors(error));
        });
    }
}
