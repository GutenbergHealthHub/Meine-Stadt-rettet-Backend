
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

export enum RoleRestrictionEnum {
    // *******************************
    // * component-specific restrictions
    // *******************************

    // disables edit possibilities in the firstresponder view
    firstresponder_readonly = 'firstresponder.readonly'
}

export enum RolePrivilegeEnum {
    // **********************
    // * SuperUser privileges
    // ***********************

    // all existing privileges
    su_any = 'su.any',
    // switch between ControlCenters
    su_CCSwitch = 'su.CCSwitch',


    // *******************************
    // * component-specific privileges
    // *******************************

    // enables buttons to change the state of a protocol (usually after he was called by the advisor)
    protocol_afterCall = 'protocol.afterCall',


    // **********************
    // * Routing privileges
    // * used to grant access to views
    // ***********************

    route_adminDashboard = 'route.adminDashboard',
    route_createEmergency = 'route.createEmergency',
    route_dashboard = 'route.dashboard',
    route_defibrillator = 'route.defibrillator',
    route_defibrillatorManagement = 'route.defibrillatorManagement',
    route_emergencyDetail = 'route.emergencyDetail',
    route_emergencyList = 'route.emergencyList',
    route_emergencyMap = 'route.emergencyMap',
    route_firstresponder = 'route.firstresponder',
    route_protocolList = 'route.protocolList',
    route_region = 'route.region',
}
