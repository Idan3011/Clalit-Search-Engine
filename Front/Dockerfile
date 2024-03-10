# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=21.6.0
ARG NGINX_VERSION=1.25.4

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION} AS builder

ARG RENDER_SERVER
ARG DB_CSV_FILE_PATH
ARG ACCSESS_TO_TABLE_PAGE
ARG PORT


ARG VITE_REACT_APP_RENDER_SERVER=http://172.27.43.56/api/v1
ARG VITE_REACT_APP_DB_CSV_FILE_PATH=./data.csv
ARG VITE_REACT_APP_ACCSESS_TO_TABLE_PAGE='&UO*cvn%3l9d4n:(&TG@(#*&'
ARG VITE_REACT_APP_PORT=8080

# ENV NODE_ENV production
# ENV VITE_REACT_APP_RENDER_SERVER ${RENDER_SERVER}
# ENV VITE_REACT_APP_DB_CSV_FILE_PATH ${DB_CSV_FILE_PATH}
# ENV VITE_REACT_APP_ACCSESS_TO_TABLE_PAGE ${ACCSESS_TO_TABLE_PAGE}
# ENV VITE_REACT_APP_PORT ${PORT}
ENV VITE_REACT_APP_RENDER_SERVER=http://172.27.43.56/api/v1
ENV VITE_REACT_APP_DB_CSV_FILE_PATH=./data.csv
ENV VITE_REACT_APP_ACCSESS_TO_TABLE_PAGE='&UO*cvn%3l9d4n:(&TG@(#*&'
ENV VITE_REACT_APP_PORT=8080

RUN npm i -g vite


WORKDIR /app

COPY package.json ./


RUN yarn



RUN echo "$VITE_REACT_APP_DB_CSV_FILE_PATH"

COPY vite.config.js ./

RUN yarn add vite
RUN yarn add @vitejs/plugin-react
RUN npm install -g serve

COPY . .

RUN yarn build

# CMD serve -s dist -l 8080
FROM nginx:${NGINX_VERSION}-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
