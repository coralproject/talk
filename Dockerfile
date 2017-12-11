FROM node:8-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup the environment
ENV PATH /usr/src/app/bin:$PATH
ENV TALK_PORT 5000
EXPOSE 5000

# Bundle app source
COPY . /usr/src/app

# Ensure the runtime of the container is in production mode.
ENV NODE_ENV production

# arguments for build
ARG TALK_THREADING_LEVEL=3
ARG TALK_DEFAULT_STREAM_TAB=all
ARG TALK_DEFAULT_LANG=en
ARG TALK_PLUGINS_JSON

RUN env

# Install app dependencies and build static assets.
RUN yarn global add node-gyp && \
    yarn install --frozen-lockfile && \
    cli plugins reconcile && \
    yarn build && \
    yarn cache clean

CMD ["yarn", "start"]
