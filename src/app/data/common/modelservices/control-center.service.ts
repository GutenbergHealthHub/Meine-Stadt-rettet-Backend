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
import { Role, User, ControlCenter } from '../models';
import { BaseModelService } from './base/base-modelservice';

@Injectable()
export class ControlCenterService extends BaseModelService<ControlCenter>  {

    constructor(protected errorService: ErrorService, protected parseService: ParseService) {
        super(errorService, parseService, ControlCenter);
    }
}
