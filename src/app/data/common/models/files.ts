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

export class Files extends BaseModel {
  public static PARSE_CLASSNAME = 'Files';

  private _title: string;
  private _short_name: string;
  private _file: Parse.File;

  constructor() {
    super(Files.PARSE_CLASSNAME);
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get short_name(): string {
    return this._short_name;
  }

  set short_name(value: string) {
    this._short_name = value;
  }

  get file(): Parse.File {
    return this._file;
  }

  set file(value: Parse.File) {
    this._file = value;
  }
}

BaseModel.registerClass(Files, Files.PARSE_CLASSNAME);
