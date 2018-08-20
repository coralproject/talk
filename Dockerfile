FROM node:8-alpine

# Install installation dependancies.
RUN apk --no-cache add git

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup the environment.
ENV NODE_ENV production

# Bundle app source
COPY . /usr/src/app

# Install app dependencies and build static assets.
RUN npm install && \
  npm run compile && \
  npm run build && \
  npm prune --production

FROM node:8-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the compiled source into the new stage.
COPY --from=0 /usr/src/app .

# Setup the environment
ENV PATH /usr/src/app/bin:$PATH
ENV PORT 5000
EXPOSE 5000
ENV NODE_ENV production

# Store the current git revision.
ARG REVISION_HASH
ENV REVISION_HASH=${REVISION_HASH}

CMD ["npm", "run", "start"]
