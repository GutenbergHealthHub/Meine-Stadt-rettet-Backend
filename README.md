# Meine Stadt rettet (Backend)

If you want to run the Meine-Stadt-rettet server locally, please follow the instructions ahead:

## Prerequisites

1.  Setup mongodb locally and import the database schema with mongorestore (for more information please go to https://docs.mongodb.com/manual/reference/program/mongorestore/)
2.  Copy sample.env in /src/environments to localhost.env and production.env and configure with your parameters
3.  To enable push notification for Android: Go to Firebase Console and create a new project. Navigate to Cloud Messaging and copy the server key. Paste the server into your environment file
4.  To enable Google Maps Apis: Go to https://developers.google.com/maps/documentation/javascript/get-api-key and the follow the guidline. Paste the google maps api key into your environment file
5.  To enable mail notification: Go to www.mailgun.com and create a new project. Copy the email API key and paste it to the environment file.

## Start Server

The package.json file has several preconfigured run scripts. Execute the scripts in the following order:

1.  `npm install`
2.  `npm run dev:src`

## Run parse dashboard

If you want to run [parse dashboard](https://github.com/parse-community/parse-dashboard) follow theses steps:

1. copy [parse-dashboard/parse-dashboard-config.json.sample](./parse-dashboard/parse-dashboard-config.json.sample) to parse-dashboard/parse-dashboard-config.json and configure with your parameters
2. run `npm run parse-dashboard:build`
3. run `npm run parse-dachboard:run`
4. open browser at [http://localhost:4040](http://localhost:4040)

## Framework PARSE

The Meine-Stadt-rettet server is built with the backend framework PARSE https://parseplatform.org/ in version 4.5.
All documented APIS in https://docs.parseplatform.org/parse-server/guide/ are working with the Meine-Stadt-rettet server.
The sourceode of parse server is in https://github.com/parse-community/parse-server
If you want to develop an Android/iOS App and connect it to the Meine-Stadt-rettet server, please follow the guidelines in https://docs.parseplatform.org/android/guide/ for Android and https://docs.parseplatform.org/ios/guide/ for iOS.

## Most Important Database Schema

-   **User:** Stores all registered users. This is a mandatory class required by PARSE
-   **Installation:** If you build an iOS/Android app with PARSE and the device is connected to the server, then the device information is stored in the Installation class. This is a mandatory class required by PARSE
-   **Emergency:** Stores all information of an occurred emergency. As soon as the server recognizes a new record in the Emergency class, then all nearby located users (User class) are receiving a push notification.
-   **EmergencyState:** All users that receive a push notification are stored in the EmergencyState class.
-   **ControlCenter:** Stores all information about registered control centers.
-   **Configuration:** Stores configuration information according which users should be notified by an incoming emergency.
-   **LocationTracking:** Stores location tracking information about users that have accepted an emergency mission. Location tracking information are inserted by the App itself
-   **Protocol:** Stores the emergency report from each user that was involved in an emergency. The emergency report follows the guideline of the _Deutsches Reanimationsregister_
-   **Defibrillator:** Stores all information about defibrillators.

## Emergency Notification

The workflow for sending emergency information to nearby users is as follows:

1.  Create an emergency record in the Emergency class. At least the location field must be filled. For more information see the API section.
2.  As soon as the server recognizes a new record in the Emergency class, it calculates automatically which users are closest to the emergency location. Hereby, it considers the configuration information within the Configuration Class. The User and Installation class must contain at least one record. In the User class the location field must be filled.
3.  A push notification is sent to all users who are nearby the emergency location.
4.  For all sent push notifications, a record in the EmergencyState class is inserted, which indicates potential first responders.
5.  The App displays the emergency and ask the user for acceptance. If the user accepts the emergency, all required emergency information are retrieved by the App from the server.
6.  The App replies with new status codes. The timestamps in the EmergencyState class are automatically updated as soon as state changes are received.
7.  The App inserts new location geopoints in the LocationTracking class as soon as the user accepts the emergency mission.

## Important APIs

Please find important APIs in the document MSR-REST Interface_en.pdf
