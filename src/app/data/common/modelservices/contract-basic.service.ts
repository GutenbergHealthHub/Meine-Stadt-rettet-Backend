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
import { ContractBasic } from '../models';

@Injectable()
export class ContractBasicService {
    constructor(private errorService: ErrorService, private parseService: ParseService) {}

    public getCurrent(): Promise<ContractBasic> {
        return new Promise<ContractBasic>((resolve, reject) => {
            const query = new Parse.Query(ContractBasic);
            query.equalTo('title', 'Basisvereinbarung');
            query.greaterThan('validUntil', new Date());
            query.lessThan('validFrom', new Date());
            query.first().then(
                (contractBasic) => resolve(contractBasic),
                (error) => this.errorService.handleParseErrors(error),
            );
        });
    }
}
