FROM node:carbon-slim

MAINTAINER jhackenberg@hms-dev.com

# Create app directory
RUN apt-get update
RUN apt-get install python -y
RUN apt-get install make -y
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied

# Setup private npm package access
# make sure the npm token is valid at the time of build
ARG NPM_TOKEN
COPY .npmrc-docker /usr/src/app/.npmrc

# Install App
COPY package*.json /usr/src/app/
RUN npm install -only=dev
RUN npm install -only=prod

# Remove private npm package access
RUN rm -f /usr/src/app/.npmrc
# Avoiding https://github.com/npm/npm/issues/19169
ENV NPM_TOKEN="redacted"

# Bundle app source
COPY . /usr/src/app

# Delete old dist and create new dist
# This was needed because start:prod does not produce dist folder
RUN npm run prestart:prod
# RUN APP
CMD ["node", "dist/main.js"]
