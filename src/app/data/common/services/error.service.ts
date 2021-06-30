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

import { EventEmitter } from 'events';
import { Injectable } from '@angular/core';
import { Parse } from '../../common-imports';

@Injectable()
export class ErrorService extends EventEmitter {
    constructor() {
        super();
    }

    public handleParseErrors(error: Parse.Error) {
        console.warn('Parse Error!');
        console.warn(error);
        switch (error.code) {
            case 100:
                this.emit(
                    'exception',
                    'The server is currently unreachable. This might be caused by missing internet connectivity or server maintenance.',
                );
                break;
            case 209:
                Parse.User.logOut();
                this.emit('exception', 'The login-session is invalid. Please log in again.', true);
                break;
            default:
                Parse.User.logOut();
        }
    }
}
