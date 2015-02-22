FROM iojs:1.2.0
MAINTAINER André König <andre.koenig@posteo.de>

RUN useradd --create-home cahoots

ADD ./ /home/cahoots/

EXPOSE 8080

WORKDIR /home/cahoots
USER cahoots
CMD "./bin/cahoots-api"
