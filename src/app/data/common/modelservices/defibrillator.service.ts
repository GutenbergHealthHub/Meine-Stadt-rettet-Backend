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
import * as supercluster from 'supercluster';
import { BaseModelService } from './base/base-modelservice';
import { ErrorService, ParseService, Parse } from '../services';
import { Emergency, EmergencyState, LocationTracking, Defibrillator, DefibrillatorState, PageInfo } from '../models';
import { Feature, Point, BBox } from 'geojson';

export interface IDefibrillatorCluster {
    size: number;
    latitude: number;
    longitude: number;
}

export interface IClusteredDefibrillators {
    clusters: Map<string, IDefibrillatorCluster>;
    defibrillators: Map<string, Defibrillator>;
}

@Injectable()
export class DefibrillatorService extends BaseModelService<Defibrillator> {

    constructor(errorService: ErrorService, parseService: ParseService) {
        super(errorService, parseService, Defibrillator);
    }

    // @ts-ignore (todo: rename)
    public getByFilter(searchQuery?: string, pageInfo?: PageInfo): Promise<Array<Defibrillator>> {
        return new Promise<Array<Defibrillator>>((resolve, reject) => {
            let query = new Parse.Query(Defibrillator);
            query.include('creator');
            if (pageInfo) {
                pageInfo.filterQuery = searchQuery;
                query = this.applyPageInfo(query, pageInfo, this.filterByAttributes);
            } else {
                query = this.applyFilter(query, searchQuery, this.filterByAttributes);
            }
            query.find().then(defibrillators => resolve(defibrillators), error => this.errorService.handleParseErrors(error));
        });
    }

    public getAll(): Promise<Array<Defibrillator>> {
        return new Promise<Array<Defibrillator>>((resolve, reject) => {
            const query: Parse.Query<Defibrillator> = new Parse.Query(Defibrillator);
            query.limit(9999999);
            query.descending('createdAt');
            query.find().then(defibrillators => resolve(defibrillators), error => this.errorService.handleParseErrors(error));
        });
    }

    private filterByAttributes(query: Parse.Query<Defibrillator>, filterQuery: string): Parse.Query<Defibrillator> {
        const queries = new Array<Parse.Query<Defibrillator>>();
        ['object', 'city', 'street'].forEach((attribute) => {
            const orQuery = new Parse.Query(Defibrillator);
            orQuery.matches(attribute, new RegExp(filterQuery), 'i');
            queries.push(orQuery);
        });
        return Parse.Query.or<Defibrillator>(...queries);
    }

    public getClusteredForArea(bbox: BBox, zoom: number): Promise<IClusteredDefibrillators> {
        return new Promise<IClusteredDefibrillators>((resolve, reject) => {
            const query = new Parse.Query(Defibrillator);
            query.limit(99999999);
            query.exists('state');
            query.notEqualTo('state', DefibrillatorState.rejected);
            query.withinGeoBox('location', new Parse.GeoPoint(bbox[0], bbox[1]), new Parse.GeoPoint(bbox[2], bbox[3]));
            query.find().then(defibrillators => {
                const clusterIndex = supercluster({
                    radius: 40,
                    maxZoom: 16
                });

                const features = new Array<Feature<Point>>();
                for (let defiIndex = 0; defiIndex < defibrillators.length; ++defiIndex) {
                    const defibrillator = defibrillators[defiIndex];
                    features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [defibrillator.location.latitude, defibrillator.location.longitude] }, properties: null, id: defiIndex });
                }

                const result: IClusteredDefibrillators = { clusters: new Map(), defibrillators: new Map() };

                clusterIndex.load(features);
                for (const feature of clusterIndex.getClusters(bbox, zoom) as Array<Feature<Point>>) {
                    if (feature.properties && feature.properties.cluster) {
                        result.clusters.set(feature.geometry.coordinates[0] + '' + feature.geometry.coordinates[1], { latitude: feature.geometry.coordinates[0], longitude: feature.geometry.coordinates[1], size: feature.properties.point_count });
                    } else {
                        result.defibrillators.set(defibrillators[feature.id].id as string, defibrillators[feature.id]);
                    }
                }
                resolve(result);
            }, error => this.errorService.handleParseErrors(error));
        });
    }
}
