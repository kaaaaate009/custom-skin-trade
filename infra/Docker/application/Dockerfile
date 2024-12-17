# syntax=docker/dockerfile:1

ARG NODE_VERSION=3.20

FROM node:alpine${NODE_VERSION}

WORKDIR /usr/src/app

COPY package.json ./package.json

RUN npm i
RUN npm install -g nodemon

USER node

COPY . .

EXPOSE 3000

CMD ["nodemon", "src/app.js"]
