#Lounas frontend

FROM node:11

MAINTAINER Henkka T

COPY ./dist /var/www
WORKDIR /var/www

RUN npm install

EXPOSE 8080

CMD ["npm","start"]