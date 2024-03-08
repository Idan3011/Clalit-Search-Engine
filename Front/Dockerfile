# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=21.6.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION} AS builder



ENV NODE_ENV production

RUN npm i -g vite


WORKDIR /app

COPY package.json ./


RUN yarn



COPY vite.config.js ./

RUN yarn add vite
RUN yarn add @vitejs/plugin-react
RUN npm install -g serve

COPY . .

RUN yarn build


CMD serve -s /app/dist -l 8080
