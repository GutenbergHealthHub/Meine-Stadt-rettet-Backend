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
import { Files } from '../models';

@Injectable()
export class FileService {

  constructor(private errorService: ErrorService, private parseService: ParseService) {
  }

  public getByShortTitle(title: string): Promise<Files> {
    return new Promise<Files>((resolve, reject) => {
      const query = new Parse.Query(Files);
      query.equalTo('short_title', title);
      query.first().then(fileItem => resolve(fileItem), error => this.errorService.handleParseErrors(error));
    });
  }
}
