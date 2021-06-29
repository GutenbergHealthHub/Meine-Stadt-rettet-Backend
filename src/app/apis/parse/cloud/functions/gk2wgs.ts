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

'use strict';

function gk2pot(gk) {

  /* Die Funktion wandelt GK Koordinaten in geographische Koordinaten
     um. Rechtswert rw und Hochwert hw müssen gegeben sein.
     Berechnet werden geographische Länge lp und Breite bp
     im Potsdam Datum. */

  // Rechtswert rw und Hochwert hw im Potsdam Datum
  if (!gk || !gk.x || !gk.y)
    return null;


  const rw = parseFloat(gk.x);
  const hw = parseFloat(gk.y);

  // Potsdam Datum
  // Große Halbachse a und Abplattung f
  const a = 6377397.155;
  const f = 3.342773154e-3;
  // f = 3.34277321e-3
  const pi = Math.PI;

  // Polkrümmungshalbmesser c
  const c = a / (1 - f);

  // Quadrat der zweiten numerischen Exzentrizität
  const ex2 = (2 * f - f * f) / ((1 - f) * (1 - f));
  const ex4 = ex2 * ex2;
  const ex6 = ex4 * ex2;
  const ex8 = ex4 * ex4;

  // Koeffizienten zur Berechnung der geographischen Breite aus gegebener
  // Meridianbogenlänge
  const e0 = c * (pi / 180) * (1 - 3 * ex2 / 4 + 45 * ex4 / 64 - 175 * ex6 / 256 + 11025 * ex8 / 16384);
  const f2 = (180 / pi) * (3 * ex2 / 8 - 3 * ex4 / 16 + 213 * ex6 / 2048 - 255 * ex8 / 4096);
  const f4 = (180 / pi) * (21 * ex4 / 256 - 21 * ex6 / 256 + 533 * ex8 / 8192);
  const f6 = (180 / pi) * (151 * ex6 / 6144 - 453 * ex8 / 12288);

  // Geographische Breite bf zur Meridianbogenlänge gf = hw
  const sigma = hw / e0;
  const sigmr = sigma * pi / 180;
  const bf = sigma + f2 * Math.sin(2 * sigmr) + f4 * Math.sin(4 * sigmr) + f6 * Math.sin(6 * sigmr);

  // Breite bf in Radianten
  const br = bf * pi / 180;
  const tan1 = Math.tan(br);
  const tan2 = tan1 * tan1;
  const tan4 = tan2 * tan2;

  const cos1 = Math.cos(br);
  const cos2 = cos1 * cos1;

  const etasq = ex2 * cos2;

  // Querkrümmungshalbmesser nd
  const nd = c / Math.sqrt(1 + etasq);
  const nd2 = nd * nd;
  const nd4 = nd2 * nd2;
  const nd6 = nd4 * nd2;
  const nd3 = nd2 * nd;
  const nd5 = nd4 * nd;

  //  Längendifferenz dl zum Bezugsmeridian lh
  const kz = parseInt('' + (rw / 1e6));
  const lh = kz * 3;
  const dy = rw - (kz * 1e6 + 500000);
  const dy2 = dy * dy;
  const dy4 = dy2 * dy2;
  const dy3 = dy2 * dy;
  const dy5 = dy4 * dy;
  const dy6 = dy3 * dy3;

  const b2 = - tan1 * (1 + etasq) / (2 * nd2);
  const b4 = tan1 * (5 + 3 * tan2 + 6 * etasq * (1 - tan2)) / (24 * nd4);
  const b6 = - tan1 * (61 + 90 * tan2 + 45 * tan4) / (720 * nd6);

  const l1 = 1 / (nd * cos1);
  const l3 = - (1 + 2 * tan2 + etasq) / (6 * nd3 * cos1);
  const l5 = (5 + 28 * tan2 + 24 * tan4) / (120 * nd5 * cos1);

  // Geographischer Breite bp und Länge lp als Funktion von Rechts- und Hochwert
  const bp = bf + (180 / pi) * (b2 * dy2 + b4 * dy4 + b6 * dy6);
  const lp = lh + (180 / pi) * (l1 * dy + l3 * dy3 + l5 * dy5);

  if (lp < 5 || lp > 16 || bp < 46 || bp > 56) {
    console.log('RW und/oder HW ungültig für das deutsche Gauss-Krüger-System');
    return null;
  }
  return { 'x': lp, 'y': bp };
}

function pot2wgs(pot) {

  /* Die Funktion verschiebt das Kartenbezugssystem (map datum) vom in
     Deutschland gebräuchlichen Potsdam-Datum zum WGS84 (World Geodetic
     System 84) Datum. Geographische Länge lp und Breite bp gemessen in
     grad auf dem Bessel-Ellipsoid müssen gegeben sein.
     Ausgegeben werden geographische Länge lw und
     Breite bw (in grad) auf dem WGS84-Ellipsoid.
     Bei der Transformation werden die Ellipsoidachsen parallel
     verschoben um dx = 587 m, dy = 16 m und dz = 393 m. */

  // Geographische Länge lp und Breite bp im Potsdam Datum
  if (!pot || !pot.x || !pot.y)
    return null;

  const lp = parseFloat(pot.x);
  const bp = parseFloat(pot.y);

  // Quellsystem Potsdam Datum
  // Große Halbachse a und Abplattung fq
  const a = 6378137.000 - 739.845;
  const fq = 3.35281066e-3 - 1.003748e-05;

  // Zielsystem WGS84 Datum
  // Abplattung f
  const f = 3.35281066e-3;

  // Parameter für datum shift
  const dx = 587;
  const dy = 16;
  const dz = 393;

  // Quadrat der ersten numerischen Exzentrizität in Quell- und Zielsystem
  const e2q = (2 * fq - fq * fq);
  const e2 = (2 * f - f * f);

  // Breite und Länge in Radianten
  const pi = Math.PI;
  const b1 = bp * (pi / 180);
  const l1 = lp * (pi / 180);

  // Querkrümmungshalbmesser nd
  const nd = a / Math.sqrt(1 - e2q * Math.sin(b1) * Math.sin(b1));

  // Kartesische Koordinaten des Quellsystems Potsdam
  const xp = nd * Math.cos(b1) * Math.cos(l1);
  const yp = nd * Math.cos(b1) * Math.sin(l1);
  const zp = (1 - e2q) * nd * Math.sin(b1);

  // Kartesische Koordinaten des Zielsystems (datum shift) WGS84
  const x = xp + dx;
  const y = yp + dy;
  const z = zp + dz;

  // Berechnung von Breite und Länge im Zielsystem
  const rb = Math.sqrt(x * x + y * y);
  const b2 = (180 / pi) * Math.atan((z / rb) / (1 - e2));

  let l2;

  if (x > 0)
    l2 = (180 / pi) * Math.atan(y / x);
  if (x < 0 && y > 0)
    l2 = (180 / pi) * Math.atan(y / x) + 180;
  if (x < 0 && y < 0)
    l2 = (180 / pi) * Math.atan(y / x) - 180;

  return { 'lat': b2, 'lon': l2 };
}

function gk2wgs(gk) {
  return pot2wgs(gk2pot(gk));
}

module.exports = {
  gk2wgs: gk2wgs,
};
