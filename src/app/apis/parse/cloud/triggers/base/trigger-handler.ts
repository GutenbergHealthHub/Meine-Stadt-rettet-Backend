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

import { BaseModelService } from 'app/data/common/modelservices/base/base-modelservice';
import { ErrorService, ParseService, ServiceManager } from 'app/data/services';

export abstract class TriggerHandler<T extends Parse.Object, A extends BaseModelService<T>> {
    public static register<T extends TriggerHandler<Parse.Object, BaseModelService<Parse.Object>>>(
        handlerConstructor: new () => T,
    ) {
        new handlerConstructor();
    }

    public constructor(
        modelConstructor: new () => T,
        serviceConstructor: new (errorService: ErrorService, parseService: ParseService) => A,
    ) {
        if (this.beforeCreate || this.beforeUpdate) {
            Parse.Cloud.beforeSave(modelConstructor, (request, response) => {
                let result = true;

                const entity = request.object as T;
                (entity as any)._setExisted(false);

                const isCreate = !(request as any).original;
                if (isCreate && this.beforeCreate) {
                    result = !(this.beforeCreate(entity) === false);
                } else if (!isCreate && this.beforeUpdate) {
                    result = !(this.beforeUpdate(entity) === false);
                }

                if (result) {
                    response.success();
                } else {
                    response.error(Parse.ErrorCode.INTERNAL_SERVER_ERROR, 'Internal Error');
                }
            });
        }

        if (this.afterCreate || this.afterUpdate) {
            Parse.Cloud.afterSave(modelConstructor, (request) => {
                const isCreate = !(request as any).original;
                ServiceManager.get(serviceConstructor)
                    .getById(request.object.id)
                    .then((entity) => {
                        if (isCreate && this.afterCreate) {
                            this.afterCreate(entity);
                        } else if (!isCreate && this.afterUpdate) {
                            this.afterUpdate(entity);
                        }
                    });
            });
        }
    }

    protected beforeCreate?(object: T): boolean | void;
    protected beforeUpdate?(object: T): boolean | void;

    protected afterCreate?(object: T): void;
    protected afterUpdate?(object: T): void;
}
