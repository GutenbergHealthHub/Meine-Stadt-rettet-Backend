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

import { CertificateService, ControlCenterService, InstallationService, UserService } from 'app/data/modelservices';
import { Certificate, Emergency, EmergencyEnum, EmergencyState, EmergencyStateEnum, User } from 'app/data/models';
import { ServiceManager } from 'app/data/services';
import { Localization } from '../../../../data/common/models';

const gk = require('./gk2wgs.js');
const MailgunAdapter = require('parse-server-mailgun/lib/MailgunAdapter');
const resolve = require('path').resolve;

const config = {
    apiKey: process.env.EMAIL_API_KEY,
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
    domain: process.env.EMAIL_DOMAIN,
    templates: {
        welcomeEmail: {
            subject: 'Willkommen bei Meine Stadt rettet',
            pathPlainText: resolve(__dirname, '../../../../public/welcome_email.txt'),
            pathHtml: resolve(__dirname, '../../../../public/welcome_email.html'),
        },
    },
};

// Parse Cloud code.
// For details see https://docs.parseplatform.org/cloudcode/guide

// #########################
// Send Emails
// Email Templates: welcomeEmail, noDocumentEmail, noSignatureEmail
// #########################
Parse.Cloud.define('sendEmail', function (request, response) {
    if (!request.params.emailTemplate) {
        response.error('Please provide emailTemplate');
        return;
    }
    if (!request.params.firstname) {
        response.error('Please provide user firstname');
        return;
    }
    if (!request.params.lastname) {
        response.error('Please provide user lastname');
        return;
    }
    if (!request.params.link) {
        response.error('Please provide url link');
        return;
    }
    const adapter = new MailgunAdapter(config);

    adapter
        ._sendMail({
            templateName: request.params.emailTemplate,
            recipient: request.params.target,
            variables: {
                firstname: request.params.firstname,
                lastname: request.params.lastname,
                link: request.params.link,
            },
            direct: true,
        })
        .then(function () {
            response.success('Email sent!');
        })
        .catch(function (error) {
            response.error('Failure: ' + error);
        });
});

// #########################
// Cancel the emergency mission for a specific first responder.
// #########################
Parse.Cloud.define('cancelFirstResponder', function (request, response) {
    if (!request.user) {
        response.error('Must be signed in to call this Cloud Function.');
        return;
    }
    if (!request.params.emergencyStateId) {
        response.error('Please indicate a valid emergency state id');
        return;
    }

    const emergencyStateQuery = new Parse.Query('EmergencyState');
    emergencyStateQuery.get(request.params.emergencyStateId).then(
        (emergencyState: EmergencyState) => {
            emergencyState.state = EmergencyStateEnum.calledBack;
            emergencyState.save().then(
                () => {
                    const installationQuery = new Parse.Query(Parse.Installation);
                    installationQuery.equalTo('objectId', emergencyState.installationRelation.id);
                    sendCancelPushToFirstresponder(
                        installationQuery,
                        emergencyState.emergencyRelation.id,
                        emergencyState.id,
                        {
                            success: function (result) {
                                response.success(result);
                            },
                            error: function (error) {
                                response.error('error 1: ' + error.message);
                            },
                        },
                    );
                },
                (error) => {
                    response.error('error 2: ' + error.message);
                },
            );
        },
        (error) => {
            response.error('error 3: ' + error.message);
        },
    );
});

// #########################
// Send Cancel Push Notification in order to cancel the emergency mission for a specific first responder. The received
// notification is processed in the App accordingly.
// #########################
function sendCancelPushToFirstresponder(installationQuery, emergencyId, emergencyStateId, callback) {
    Parse.Push.send(
        {
            where: installationQuery,
            // channels: ["global"],
            data: {
                alert: 'Notfall abgebrochen!',
                aps: {
                    'content-available': '1',
                },
                emergencyId: emergencyId,
                emergencyStateId: emergencyStateId,
                cancel: true,
            },
        },
        // @ts-ignore
        {
            useMasterKey: true,
            // @ts-ignore
            success: function (result) {
                callback.success(result);
            },
            error: function (error) {
                callback.error(error);
            },
        },
    );
}

// #########################
// Cancel the whole emergency for all involved first responders.
// #########################
Parse.Cloud.define('cancelEmergency', function (request, response) {
    if (!request.user) {
        response.error('Must be signed in to call this Cloud Function.');
        return;
    }
    if (!request.params.emergencyId) {
        response.error('Please indicate a valid emergency id');
        return;
    }

    const EmergencyQuery = new Parse.Query('Emergency');
    let length = 0;
    const emergencyStateQuery = new Parse.Query('EmergencyState');
    EmergencyQuery.get(request.params.emergencyId).then((emergency: Emergency) => {
        emergency.state = 12;
        emergency.save().then(
            (emergency: Emergency) => {
                const installationQuery = new Parse.Query(Parse.Installation);
                emergencyStateQuery.equalTo('emergencyRelation', emergency);
                emergencyStateQuery.equalTo('state', 3);
                emergencyStateQuery.matchesQuery('installationRelation', installationQuery);

                emergencyStateQuery.find().then(
                    (emergencyStates: Array<EmergencyState>) => {
                        length = emergencyStates.length;
                        for (let i = 0; i < emergencyStates.length; i++) {
                            // select current user in the loop
                            const emergencyState: EmergencyState = emergencyStates[i];
                            emergencyState.state = EmergencyStateEnum.calledBack;
                            emergencyState.save().then(
                                (res) => {
                                    const query = new Parse.Query(Parse.Installation);
                                    query.equalTo('objectId', res.get('installationRelation').id);
                                    sendCancelPushToFirstresponder(query, res.get('installationRelation').id, res.id, {
                                        success: function () {
                                            response.success('success');
                                        },
                                        error: function (error) {
                                            response.error(error.message);
                                        },
                                    });
                                },
                                (error) => {
                                    response.error(error.message);
                                },
                            );
                        }
                    },
                    (error) => {
                        response.error(error.message);
                    },
                );
            },
            (error) => {
                response.error(error.message);
            },
        );
    });

    response.success('null');
});

// #########################
// Finish the Emergency and set the emergeny state to 20 = finish
// #########################
Parse.Cloud.define('finishEmergency', function (request, response) {
    if (!request.user) {
        response.error('Must be signed in to call this Cloud Function.');
        return;
    }
    if (!request.params.emergencyId) {
        response.error('Please indicate a valid emergency id');
        return;
    }
    const emergencyStateQuery = new Parse.Query('EmergencyState');
    emergencyStateQuery.equalTo('emergencyRelation', request.params.emergencyId);
    emergencyStateQuery.greaterThan('state', 2);
    emergencyStateQuery.count().then(function (cnt) {
        const count = cnt > 0 ? 20 : 21;
        const EmergencyQuery = new Parse.Query('Emergency');
        EmergencyQuery.get(request.params.emergencyId).then((emergency: Emergency) => {
            emergency.state = count;
            emergency.save().then(
                (result) => {
                    response.success(result);
                },
                (err) => {
                    response.error(err);
                },
            );
        });
    });
});

// #########################
// Modify or change specific associations with users like control center, contract, or certificate associations.
// #########################
Parse.Cloud.define('modifyUser', function (request, response) {
    console.log('modifyUser');
    if (!request.user) {
        response.error('Must be signed in to call this Cloud Function.');
        return;
    }
    if (!request.params.key) {
        response.error('Please indicate a valid field to be modified');
        return;
    }
    if (typeof request.params.input === 'undefined') {
        response.error('Please indicate a valid value');
        return;
    }
    if (!request.params.userid) {
        response.error('Please indicate a valid user id');
        return;
    }

    const query = new Parse.Query(Parse.User);
    query.get(request.params.userid, {
        success: function (userObject) {
            console.log('user Object retrieved');
            if (request.params.key === 'controlCenterRelation') {
                const controlCenterQuery = new Parse.Query('ControlCenter');
                controlCenterQuery.get(request.params.input).then(function (data) {
                    userObject.set(request.params.key, data);
                    userObject.save(null, {
                        useMasterKey: true,
                        success: function (user) {
                            response.success(user);
                        },
                        error: function (err) {
                            response.error(err);
                        },
                    });
                });
            } else if (request.params.key === 'userContractBasic') {
                console.log('user Contract');
                const userContractBasic = new Parse.Query('UserContractBasic');
                if (request.params.input === 'null') {
                    userObject.unset(request.params.key);
                    userObject.save(null, {
                        useMasterKey: true,
                        success: function (user) {
                            response.success(user);
                        },
                        error: function (err) {
                            response.error(err);
                        },
                    });
                } else {
                    userContractBasic.get(request.params.input, {
                        success: function (item) {
                            userObject.set(request.params.key, item);
                            userObject.save(null, {
                                useMasterKey: true,
                                success: function (user) {
                                    response.success(user);
                                },
                                error: function (err) {
                                    response.error(err);
                                },
                            });
                        },
                    });
                }
            } else if (request.params.key === 'certificateFR') {
                const certificateFR = new Parse.Query('Certificate');
                if (request.params.input === 'null') {
                    userObject.unset(request.params.key);
                    userObject.save(null, {
                        useMasterKey: true,
                        success: function (user) {
                            response.success(user);
                        },
                        error: function (err) {
                            response.error(err);
                        },
                    });
                } else {
                    certificateFR.get(request.params.input, {
                        success: function (data) {
                            userObject.set('activated', false);
                            userObject.set(request.params.key, data);
                            userObject.save(null, {
                                useMasterKey: true,
                                success: function (user) {
                                    response.success(user);
                                },
                                error: function (err) {
                                    response.error(err);
                                },
                            });
                        },
                    });
                }
            } else {
                let value = null;
                if (request.params.key === 'phoneNumber' || request.params.key === 'phoneCode') {
                    value = parseFloat(request.params.input);
                } else {
                    value = request.params.input;
                }
                userObject.set(request.params.key, value);
                userObject.save(null, {
                    useMasterKey: true,
                    success: function (user) {
                        response.success(user);
                    },
                    error: function (err) {
                        response.error(err);
                    },
                });
            }
        },
        error: function (err) {
            response.error(err);
        },
    });
});

// #########################
// Remove user with all generated and associated information from the system.
// #########################
Parse.Cloud.define('deleteUser', function (request, response) {
    if (!request.user) {
        response.error('Must be signed in to call this Cloud Function.');
        return;
    }
    if (!request.params.userId) {
        response.error('A user ID must be provided');
        return;
    }

    const certificateService = ServiceManager.get(CertificateService);
    const userService = ServiceManager.get(UserService);

    userService.getById(request.params.userId).then(
        (user) => {
            if (user.certificates) {
                for (const certificate of user.certificates) {
                    certificateService.getById(certificate.id).then((item) => {
                        if (item instanceof Parse.Object) item.destroy({ useMasterKey: true });
                    });
                }
            }
            if (user.userContractBasic) user.userContractBasic.destroy({ useMasterKey: true });
            if (user.certificateFR) user.certificateFR.destroy({ useMasterKey: true });
            user.destroy({ useMasterKey: true }).then(
                (user) => {
                    response.success('User successfully deleted');
                },
                (error) => {
                    response.error('Error in deleting user: ' + error.message);
                },
            );
        },
        (error) => {
            response.error(error.message);
        },
    );
});

Parse.Cloud.define('resetUserPassword', function (request, response) {
    if (!request.params.email) {
        response.error('Missing parameter: email.');
        return;
    }

    Parse.User.requestPasswordReset(request.params.email, {
        success: function (success) {
            response.success(success);
        },
        error: function (error) {
            response.error(error);
        },
    });
});

// #########################
// Create test alarm for a specific user ID or installation ID
// #########################
Parse.Cloud.define('createTestAlarm', (request, response) => {
    if (!request.user) {
        response.error('Must be signed in to call this Cloud Function.');
        return;
    }
    if (!request.params.userId) {
        response.error('A valid user must be provided');
        return;
    }

    const controlCenterService = ServiceManager.get(ControlCenterService);
    const userService = ServiceManager.get(UserService);
    const installationService = ServiceManager.get(InstallationService);
    let ccName = 'Probealarm';
    if (request.params.controlCenter) {
        ccName = request.params.controlCenter;
    }

    controlCenterService.getFirstByAttribute('name', ccName).then((controlCenter) => {
        if (request.params.installationId) {
            installationService.getById(request.params.installationId).then((installation) => {
                userService.getById(request.params.userId).then((user: User) => {
                    if (user.location) {
                        const emergency = new Emergency();
                        const localization = new Localization(installation.localeIdentifier);
                        emergency.testEmergencySendBy = user;
                        emergency.emergencyNumberDC = Math.floor(Math.random() * 90000000 + 10000000).toString();
                        emergency.informationString = localization.informationString();
                        emergency.objectName = localization.objectName();
                        emergency.locationPoint = GeoPointUtil.generateRandomPoint(user.location, 1000); // Get random geo coordinates within the user radius of 1000m.
                        emergency.controlCenterRelation = controlCenter;
                        emergency.state = EmergencyEnum.new;
                        emergency.keyword = localization.keyword();
                        emergency.patientName = localization.patientName();
                        emergency.indicatorName = localization.indicatorName();
                        emergency.country = localization.country();
                        emergency.save().then(
                            (succ) => {
                                response.success('Cloud createTestAlarm succeeded');
                            },
                            (error) => {
                                response.error('Cloud createTestAlarm error: ' + error.message);
                            },
                        );
                    } else {
                        response.error('User does not have any location');
                    }
                });
            });
        } else {
            userService.getById(request.params.userId).then((user: User) => {
                if (user.location) {
                    const emergency = new Emergency();
                    const localization = new Localization('de-DE');
                    emergency.testEmergencySendBy = user;
                    emergency.emergencyNumberDC = Math.floor(Math.random() * 90000000 + 10000000).toString();
                    emergency.informationString = localization.informationString();
                    emergency.objectName = localization.objectName();
                    emergency.locationPoint = GeoPointUtil.generateRandomPoint(user.location, 1000); // Get random geo coordinates within the user radius of 1000m.
                    emergency.controlCenterRelation = controlCenter;
                    emergency.state = EmergencyEnum.new;
                    emergency.keyword = localization.keyword();
                    emergency.patientName = localization.patientName();
                    emergency.indicatorName = localization.indicatorName();
                    emergency.country = localization.country();
                    emergency.save().then(
                        (succ) => {
                            response.success('Cloud createTestAlarm succeeded');
                        },
                        (error) => {
                            response.error('Cloud createTestAlarm error: ' + error.message);
                        },
                    );
                } else {
                    response.error('User does not have any location');
                }
            });
        }
    });
});

// #########################
// Get random geo coordinates within a specific user radius
// #########################
class GeoPointUtil {
    public static generateRandomPoint(center: Parse.GeoPoint, maxDistanceInM: number): Parse.GeoPoint {
        const lat = (center.latitude * Math.PI) / 180;
        const lng = (center.longitude * Math.PI) / 180;

        let radius = Math.random() + Math.random();
        radius = radius > 1 ? 2 - radius : radius;
        radius *= maxDistanceInM;
        radius /= 111319.9;
        radius *= Math.PI / 180;

        const angle = Math.random() * Math.PI * 2;

        let nLng = 0;
        const nLat = Math.asin(Math.sin(lat) * Math.cos(radius) + Math.cos(lat) * Math.sin(radius) * Math.cos(angle));

        if (Math.cos(nLat) == 0) {
            nLng = lng;
        } else {
            nLng =
                ((lng - Math.asin((Math.sin(angle) * Math.sin(radius)) / Math.cos(nLat)) + Math.PI) % (Math.PI * 2)) -
                Math.PI;
        }

        return new Parse.GeoPoint((nLat * 180) / Math.PI, (nLng * 180) / Math.PI);
    }
}
