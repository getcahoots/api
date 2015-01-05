FROM node:0.10
MAINTAINER André König <andre.koenig@posteo.de>

RUN apt-get update && apt-get install -y git
RUN useradd --create-home cahoots

RUN npm update npm
RUN npm i -g git+https://github.com/akoenig/cahoots-backend.git

ENV DEBUG cahoots:*

EXPOSE 8080

USER cahoots
CMD "cahoots-backend"