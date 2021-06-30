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

export class PageInfo {
    private _order: string;
    private _orderAsc: boolean;
    private _totalCount: number;
    private _pageOffset: number;
    private _rowLimit: number;
    private _filterQuery: string;

    public constructor(rowLimit: number, order: string, orderAsc = true) {
        this.rowLimit = rowLimit;
        this.order = order;
        this.pageOffset = 0;
        this.orderAsc = orderAsc;
        this.totalCount = 0;
        this.filterQuery = '';
    }

    public get order(): string {
        return this._order;
    }

    public set order(value: string) {
        this._order = value;
    }

    public get orderAsc(): boolean {
        return this._orderAsc;
    }

    public set orderAsc(value: boolean) {
        this._orderAsc = value;
    }

    public get totalCount(): number {
        return this._totalCount;
    }

    public set totalCount(value: number) {
        this._totalCount = value;
    }

    public get pageOffset(): number {
        return this._pageOffset;
    }

    public set pageOffset(value: number) {
        this._pageOffset = value;
    }

    public get rowLimit(): number {
        return this._rowLimit;
    }

    public set rowLimit(value: number) {
        this._rowLimit = value;
    }

    public get filterQuery(): string {
        return this._filterQuery;
    }

    public set filterQuery(value: string) {
        this._filterQuery = value;
    }
}
