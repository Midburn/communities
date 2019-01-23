FROM node:10.15.0
RUN apt-get update && apt-get install -y build-essential mysql-client

RUN adduser --system communities
COPY package.json package-lock.json /home/communities/
RUN chown -R communities /home/communities/
USER communities
RUN cd /home/communities && npm install --ignore-scripts --pure-lockfile
RUN cd /home/communities && npm rebuild node-sass --force

USER root
COPY . /home/communities
WORKDIR /home/communities

ENV PATH="/home/communities/node_modules/.bin:${PATH}"
RUN npm run build

ENTRYPOINT ["/home/communities/entrypoint.sh"]
