FROM iojs:1.1.0
MAINTAINER André König <andre.koenig@posteo.de>

RUN useradd --create-home cahoots

RUN npm update npm
RUN npm i -g git+https://github.com/cahoots-extension/api.git

ENV DEBUG cahoots:*

EXPOSE 9090

WORKDIR /home/cahoots
USER cahoots
CMD "cahoots-api"
