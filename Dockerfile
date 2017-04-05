FROM node:7

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup the environment
ENV PATH /usr/src/app/bin:$PATH
ENV TALK_PORT 5000
EXPOSE 5000

# Bundle app source
COPY . /usr/src/app

# Install app dependencies and build static assets.
RUN yarn install --frozen-lockfile && \
    cli plugins reconcile && \
    yarn build && \
    yarn install --production && \
    yarn cache clean

# Ensure the runtime of the container is in production mode.
ENV NODE_ENV production

CMD ["yarn", "start"]
