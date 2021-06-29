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

import { ParseService, Parse } from '../../services/parse.service';
export { Parse };

export interface IPointer {
    __type: string;
    className: string;
    objectId: string;
}

export class BaseModel extends Parse.Object {
    public static registerClass(classObject: any, className: string) {
        Parse.Object.registerSubclass(className, classObject);
    }

    constructor(className: string) {
        super(className);
        if (className === '' || className === undefined) {
            console.warn('Constructor called without class name!');
        }
    }

    public save(): Parse.Promise<this> {
        for (const attrKey of Object.keys(this)) {
            if (attrKey[0] === '_' && attrKey !== '_objCount') {
                this.set(attrKey.substr(1), this[attrKey]);
            }
        }
        if (ParseService.isParseServer()) {
            return super.save(null, { useMasterKey: true });
        } else {
            return super.save();
        }
    }

    public getAsPointer(): IPointer {
        return { __type: 'Pointer', className: this.className, 'objectId': this.id };
    }

    protected initArray(obj: Array<any>) {
        return new Array();
    }

    private _setExisted(isExisted: boolean) {
        if (!this.existed()) {
            for (const attrKey of Object.keys(this)) {
                if (attrKey[0] === '_' && attrKey !== '_objCount' && attrKey !== '_id') {
                    delete this[attrKey];
                }
            }
        }

        for (const attrKey of Object.keys(this.attributes)) {
            if (this[attrKey] === undefined) {
                this['_' + attrKey] = this.get(attrKey);
            }
        }
        super['_setExisted'](isExisted);
    }
}
