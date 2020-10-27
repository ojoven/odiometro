## Dockerfile for building development image
FROM node:14.12-alpine3.12
LABEL maintainer "Igor Pellegrini <igor.pellegrini@live.com>"

ENV NODE_ENV=development

# Install system dependencies
# bzip2 to install phantomjs; bash to run entrypoint
USER root
RUN apk update && apk add --no-cache --upgrade bash bzip2

WORKDIR /home/node/app
RUN chown node:node -R /home/node/app

# copy custom entrypoint + related functions
COPY --chown=node:node ./docker/bash_functions.sh /scripts/bash_functions.sh
COPY --chown=node:node ./docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# copy installation manifests fist (to allow caching NPM installation)
COPY --chown=node:node ./package.json /home/node/app/package.json
COPY --chown=node:node ./public/package.json /home/node/app/public/package.json

# set user to run NPM scripts
# RUN npm config set user node

# Install application
USER node

RUN npm install
RUN cd public && npm install

# copy the rest of the application code
COPY --chown=node:node . /home/node/app

# RUN ./home/node/app/public/node_modules/grunt/bin/grunt

EXPOSE $PORT

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["/usr/local/bin/docker-entrypoint.sh", "npm", "start"]
