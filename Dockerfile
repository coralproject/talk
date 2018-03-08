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

# Store the current git revision.
ARG REVISION_HASH
ENV REVISION_HASH=${REVISION_HASH}

# Install app dependencies and build static assets.
RUN yarn global add node-gyp && \
    yarn install --frozen-lockfile && \
    yarn build && \
    yarn cache clean

CMD ["yarn", "start"]
