# syntax=docker/dockerfile:1

ARG NODE_VERSION=3.20

FROM node:alpine${NODE_VERSION}

WORKDIR /usr/src/app

#RUN --mount=type=bind,source=package.json,target=/usr/src/app/package.json \
#    --mount=type=bind,source=package-lock.json,target=/usr/src/app/package-lock.json \
#    --mount=type=cache,target=/root/.npm \
#    npm ci --omit=dev

COPY package.json ./package.json

RUN npm i
RUN npm install -g nodemon

USER node

COPY . .

EXPOSE 3000

CMD ["nodemon", "src/app.js"]
