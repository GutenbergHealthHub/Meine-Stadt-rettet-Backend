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

import { Express } from 'express';
import { ParseServer } from 'parse-server';
import { BaseAPI } from '../base/base.api';
import { resolve } from 'path';

export class ParseAPI extends BaseAPI {
    constructor(app: Express) {
        super(app);

        // This will enable the Live Query real-time server
        app.on('HTTP_SERVER_LISTENS', (server) => {
            ParseServer.createLiveQueryServer(server);
            console.log('Parse LiveQuery Server started');
        });
    }

    // Initialize Parse Server and setup all required configuration fields.
    protected createHandler(): ParseServer {
        return new ParseServer({
            databaseURI: process.env.MONGOLAB_URI,
            cloud: __dirname + '/cloud/cloud.js',
            appId: process.env.APP_ID,
            masterKey: process.env.MASTER_KEY, // Add your master key here. Keep it secret!
            restAPIKey: process.env.REST_API_KEY,
            javascriptKey: process.env.JAVASCRIPT_KEY,
            clientKey: process.env.CLIENT_KEY,
            serverURL: process.env.SERVER_URL + process.env.PARSE_MOUNT || 'http://localhost:1337/parse', // Don't forget to change to https if needed
            verbose: process.env.ENABLE_PARSE_VERBOSE_MODE == 'true',
            logLevel: 'error',
            liveQuery: {
                classNames: ['Emergency', 'EmergencyState', 'LocationTracking', '_User'], // List of classes to support for query subscriptions
            },
            verifyUserEmails: true,
            emailVerifyTokenValidityDuration: 24 * 60 * 60, // in seconds (2 hours = 7200 seconds)
            publicServerURL: process.env.SERVER_URL + process.env.PARSE_MOUNT || 'http://localhost:1337/parse',
            appName: 'Meine-Stadt-rettet',
            emailAdapter: {
                module: 'parse-server-mailgun',
                options: {
                    // The address that your emails come from
                    fromAddress: process.env.EMAIL_FROM_ADDRESS,
                    // Your domain from mailgun.com
                    domain: process.env.EMAIL_DOMAIN,
                    // Your API key from mailgun.com
                    apiKey: process.env.EMAIL_API_KEY,
                    templates: {
                        passwordResetEmail: {
                            subject: 'Zurücksetzen Ihres Passworts',
                            pathPlainText: resolve(__dirname, '../../public/password_reset_email.txt'),
                            pathHtml: resolve(__dirname, '../../public/password_reset_email.html'),
                            callback: (user) => {
                                return { firstName: user.get('firstname'), lastName: user.get('lastname') };
                            },
                        },
                        verificationEmail: {
                            subject: 'Bitte verifizieren Sie Ihre Email für Meine-Stadt-rettet',
                            pathPlainText: resolve(__dirname, '../../public/verification_email.txt'),
                            pathHtml: resolve(__dirname, '../../public/verification_email.html'),
                            callback: (user) => {
                                return { firstName: user.get('firstname'), lastName: user.get('lastname') };
                            },
                            // Now you can use {{firstName}} in your templates
                        },
                    },
                },
            },

            // Custom email templates
            customPages: {
                verifyEmailSuccess: process.env.SERVER_URL + '/public/verify_email_success.html',
                choosePassword: process.env.SERVER_URL + '/public/choose_password.html',
                passwordResetSuccess: process.env.SERVER_URL + '/public/password_reset_success.html',
            },

            // Push notification server keys for android and ios
            push: {
                android: {
                    apiKey: process.env.ANDROID_API_KEY, // Firebase server key for cloud messaging. Please create project in https://console.firebase.google.com/
                },
                /* activate with p12 certificate
                ios:
                {
                    pfx: resolve(__dirname, '../../certificates/msr.p12'), // The filename of private key and certificate in PFX or PKCS12 format from disk
                    bundleId: process.env.BUNDLE_PROD_ID, // The bundle identifier associate with your app
                    production: true // Specifies which environment to connect to: Production (if true) or Sandbox
                }
                */
            },
        });
    }
}
