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

import { BaseModelService } from '../../common/modelservices/base/base-modelservice';
import { ParseService, ErrorService } from '../../common/services';

export class ServiceManager {
    private static objectMap = ServiceManager.init();

    private static init(): Map<string, Object> {
        const objectMap = new Map<string, Object>();
        return objectMap;
    }

    public static get<T>(plainCtor: new (...args: any[]) => T): T {
        const ctor: any = plainCtor;
        let result = ServiceManager.objectMap.get(ctor.name) as T;
        if (!result) {
            if (ctor == ParseService) {
                result = new ctor(this.get<ErrorService>(ErrorService));
            } else if (ctor.prototype instanceof BaseModelService) {
                result = new ctor(this.get<ErrorService>(ErrorService), this.get<ParseService>(ParseService));
            } else {
                result = new ctor();
            }
            ServiceManager.objectMap.set(ctor.name, result);
        }
        return result as T;
    }
}
