FROM node:0.10
MAINTAINER André König <andre.koenig@posteo.de>

RUN useradd --create-home cahoots

RUN npm update npm

USER cahoots

ENV HOME /home/cahoots
ENV DEBUG cahoots:*

WORKDIR /home/cahoots
RUN mkdir -p backend

USER cahoots
ADD ./ /home/cahoots/backend

WORKDIR /home/cahoots/backend
RUN npm i -g

EXPOSE 8080

CMD "cahoots-backend"