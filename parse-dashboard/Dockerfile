FROM node:14

RUN mkdir -p /usr/parse-dashboard

COPY package.json /usr/parse-dashboard
COPY parse-dashboard-config.json /usr/parse-dashboard

WORKDIR /usr/parse-dashboard

EXPOSE 4040 4040
RUN npm install
CMD npm start