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

import * as appModulePath from 'app-module-path';
appModulePath.addPath('__dirname' + '/..');
import * as dotenv from 'dotenv';
if (process.env.NODE_ENV === 'dev') {
    dotenv.config({ path: __dirname + '/../environments/localhost.env' });
} else {
    dotenv.config({ path: __dirname + '/../environments/production.env' });
}

import errorHandler from 'errorhandler';
import app from './app';
import * as http from 'http';

// declare var Parse;
/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server
 */
// activate if SSL is needed
if (process.env.PROD === 'true') {
    /*
    const privateKey = fs.readFileSync(resolve(__dirname, 'certificates/msr.de.key.pem'), 'utf8'); // privateKey in *.pem
    const certificate = fs.readFileSync(resolve(__dirname, 'certificates/msr.de.pem'), 'utf8'); // certificate in *.pem
    const credentials = { key: privateKey, cert: certificate, passphrase: process.env.PASSPHRASE };
    const port = 443;
    const httpsServer = require('https').createServer(credentials, app);
    httpsServer.listen(port, () => {
        console.log('parse-server running on port ' + port + '.');
        app.emit('HTTP_SERVER_LISTENS', httpsServer);
    });
    */
} else {
    const port = process.env.PORT || 1337;
    const server = new http.Server(app);
    server.listen(port, () => {
        console.log('Server running on port ' + port + '.');
        app.emit('HTTP_SERVER_LISTENS', server);
    });
}
