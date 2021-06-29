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

import maps from '@google/maps';

export class GoogleMapsService {
    private static googleMapsClient = maps.createClient({ key: process.env.MAPS_API_KEY, language: 'de', Promise: Promise });
    public getClient() {
        return GoogleMapsService.googleMapsClient;
    }

    public getGeolocationFromAddress(address: string): Promise<Parse.GeoPoint> {
        return new Promise<Parse.GeoPoint>((resolve, reject) => {
            this.getClient().geocode({address: address}, (error, response) => {
                if (error == null) {
                    const geometry = response.json.results[0].geometry;
                    resolve(new Parse.GeoPoint({
                        latitude: geometry.location.lat,
                        longitude: geometry.location.lng
                    }));
                } else {
                    console.warn(error);
                    reject(error);
                }
            });
        });
    }
}

