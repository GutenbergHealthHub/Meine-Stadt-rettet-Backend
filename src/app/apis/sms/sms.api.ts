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
 * 
 * 
 */

import { BaseAPI } from '../base/base.api';
import { Request, Response, NextFunction, RequestHandler, Express, Router } from 'express';
import { SMSController } from './sms.controller';

export class SMSAPI extends BaseAPI {
    private smsController = new SMSController();
    constructor(app: Express) {
        super(app);

        this.getRouter().post('/i-digital-m', (req: Request, res: Response) => {
            const regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
            //const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const ip = req.connection.remoteAddress;
            const regexResult = regex.exec(ip);
            if (regexResult !== null) {
                console.log(regexResult[0]);
                if (regexResult[0] != '213.158.112.52') {
                    res.status(404).send();
                } else if (!req.body) {
                    res.status(400).send('No arguments given');
                } else {
                    // const requiredFields = ['MO', 'srcAddress', 'dstAddress', 'addedDate'];
                    const requiredFields = ['content', 'sender'];
                    const missingFields = requiredFields.filter((field) => !req.body.hasOwnProperty(field));
                    if (missingFields.length > 0) {
                        res.status(400).send('Missing argument(s): ' + missingFields.join('; '));
                    } else {
                        let content = req.body.content as string;
                        if (content.toLowerCase().startsWith('ecorium ')) {
                            content = content.substr('ecorium '.length);
                        } else if (content.toLowerCase().startsWith('ecorium')) {
                            content = content.substr('ecorium'.length);
                        }

                        // this.smsController.consumeIncomingSMS('i-digital-m', new Date(req.body.addedDate), req.body.srcAddress, req.body.dstAddress, req.body.MO)
                        this.smsController.consumeIncomingSMS('i-digital-m', new Date(), req.body.sender, '4915735981506', content)
                            .then(() => res.sendStatus(200))
                            .catch((error) => res.status(400).send(error));
                    }
                }
            } else {
                res.status(404).send();
            }
        });
    }
}
