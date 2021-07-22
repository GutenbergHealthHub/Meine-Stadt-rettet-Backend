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

import { environment } from '../../common-imports';
import { Injectable } from '@angular/core';
import { Parse } from '../../common-imports';
export { Parse };
import { Subject, Observable } from 'rxjs';
import { ErrorService } from './error.service';

interface ISubscriptionDescriptor {
    subjects: Map<number, Subject<INextState<Parse.Object>>>;
    nextSubscriptionId: number;
    state: Map<string, Parse.Object>;
    subscription: any;
    creationPromise: Promise<Map<string, Parse.Object>>;
}

export class Subscription<T extends Parse.Object = Parse.Object> {
    private _token: string;
    private _observable: Observable<INextState<T>>;
    private _state: Map<string, T>;
    private parseService: ParseService;
    constructor(
        token: string,
        observable: Observable<INextState<T>>,
        state: Map<string, T>,
        parseService: ParseService,
    ) {
        this._token = token;
        this._observable = observable;
        this._state = state;
        this.parseService = parseService;
    }

    public onNext(callback: (next: INextState<T>) => void): void {
        this.observable.subscribe(callback);
    }

    public unsubscribe() {
        if (this.token) {
            this.parseService.unsubscribe(this);
            delete this._token;
        }
    }

    public get state(): Map<string, T> {
        return this._state;
    }

    public set state(value: Map<string, T>) {
        this._state = value;
    }

    public get token(): string {
        return this._token;
    }

    private get observable(): Observable<INextState<T>> {
        return this._observable;
    }
}

export interface INextState<T extends Parse.Object> {
    action: string;
    state: Map<string, T>;
    objectId: number;
}

@Injectable()
export class ParseService {
    private subscriptions = new Map<string, ISubscriptionDescriptor>();

    public static isParseServer(): boolean {
        return !(Parse.Cloud.define === undefined);
    }

    constructor(private errorService: ErrorService) {
        // Initialize, if not a parse server
        if (!ParseService.isParseServer()) {
            if (environment.PARSE) {
                // @ts-ignore
                Parse.initialize(environment.PARSE.APP_ID, environment.PARSE.JS_KEY);
                // @ts-ignore
                (Parse as any).serverURL = environment.PARSE.URL;
            } else {
                // @ts-ignore
                Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY, environment.PARSE_MASTER_KEY);
                // @ts-ignore
                (Parse as any).Parse.serverURL = environment.PARSE_URL;
                Parse.Cloud.useMasterKey();
            }
        }
    }

    public fileToParse(file: File, fileName?: string): Parse.File {
        return new Parse.File(fileName ? fileName : this.encodeFileName(file.name), file);
    }

    public subscribe<T extends Parse.Object = Parse.Object>(query: Parse.Query) {
        return new Promise<Subscription<T>>((resolve, reject) => {
            const queryId = this.getQueryId(query);
            const createSubscription = !this.subscriptions.has(queryId);
            if (!this.subscriptions.has(queryId)) {
                this.subscriptions.set(queryId, {
                    subjects: new Map(),
                    nextSubscriptionId: 0,
                    state: new Map(),
                    subscription: null,
                    creationPromise: new Promise<Map<string, Parse.Object>>((resolveCreation, rejectCreation) => {
                        this.createSubscription(queryId, query).then((state) => {
                            resolveCreation(state);
                        });
                    }),
                });
            }

            const subObj = this.subscriptions.get(queryId);
            const subscriptionId = ++subObj.nextSubscriptionId;
            const subToken = queryId + ':' + subscriptionId;
            const subject = new Subject<INextState<T>>();
            subObj.subjects.set(subscriptionId, subject);

            subObj.creationPromise.then((state) => {
                resolve(new Subscription<T>(subToken, subject.asObservable(), state as Map<string, T>, this));
            });
        });
    }

    public unsubscribe(subscription: Subscription) {
        const tokenParts = subscription.token.split(':');
        const queryId = tokenParts[0];
        const subscriptionId = parseInt(tokenParts[1], 10);

        const subObj = this.subscriptions.get(queryId);
        subObj.subjects.delete(subscriptionId);
        if (subObj.subjects.size <= 0) {
            if (subObj.subscription !== undefined) {
                subObj.subscription.unsubscribe();
            }
            this.subscriptions.delete(queryId);
        }
    }

    public patchSubclass(subclassObject: Parse.Object) {
        if (subclassObject === undefined || subclassObject == null) {
            return subclassObject;
        }
        const jsonObject = subclassObject.toJSON();
        jsonObject.className = subclassObject.className;
        return Parse.Object.fromJSON(jsonObject, true);
    }

    private createSubscription<T extends Parse.Object = Parse.Object>(queryID, query: Parse.Query) {
        return new Promise<Map<string, T>>((resolve, reject) => {
            const current = this;
            query.find({
                success: (objectList) => {
                    if (current.subscriptions.has(queryID)) {
                        const subObj = current.subscriptions.get(queryID);
                        for (let indexOfObjects = 0; indexOfObjects < objectList.length; ++indexOfObjects) {
                            subObj.state.set(objectList[indexOfObjects].id, objectList[indexOfObjects]);
                        }
                        subObj.subscription = (query as any).subscribe();
                        ['create', 'enter', 'update'].forEach((command) => {
                            subObj.subscription.on(command, (object) => {
                                const objectId = object.id;
                                subObj.state.set(objectId, current.patchSubclass(object));
                                for (const subject of Array.from(subObj.subjects.values())) {
                                    subject.next({
                                        action: command,
                                        state: subObj.state,
                                        objectId: objectId,
                                    });
                                }
                            });
                        });

                        ['leave', 'delete'].forEach((command) => {
                            subObj.subscription.on(command, (object) => {
                                const objectId = object.id;
                                subObj.state.delete(objectId);
                                for (const subject of Array.from(subObj.subjects.values())) {
                                    subject.next({
                                        action: command,
                                        state: subObj.state,
                                        objectId: objectId,
                                    });
                                }
                            });
                        });

                        subObj.subscription.on('open', () => {
                            resolve(subObj.state as Map<string, T>);
                        });
                    }
                },
                error: (aError) => {
                    this.errorService.handleParseErrors(aError);
                    reject(aError);
                },
            });
        });
    }

    private getQueryId(query: Parse.Query): string {
        return query.className + '#' + JSON.stringify(query.toJSON()).replace(/[:\"]/g, '');
    }

    private encodeFileName(fileName: string): string {
        fileName = fileName.replace(new RegExp(/((?![a-zA-Z0-9-_\.\ ]).)/gm), '');
        return fileName.replace(' ', '_');
    }
}
