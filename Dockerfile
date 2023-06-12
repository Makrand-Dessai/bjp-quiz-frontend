FROM node:18.14.0 as build
WORKDIR /bjp-quiz-frontend

COPY package*.json .
RUN npm install
COPY . .

RUN npm run build
FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /bjp-quiz-frontend/build /usr/share/nginx/html