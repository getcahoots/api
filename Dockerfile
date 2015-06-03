FROM iojs:2.2
MAINTAINER André König <andre@cahoots.ninja>

RUN useradd --create-home cahoots

ADD ./ /home/cahoots/

EXPOSE 8080
ENV PORT 8080

WORKDIR /home/cahoots
USER cahoots
RUN npm i --production

CMD "./bin/cahoots-api"
