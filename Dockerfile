FROM node:12-alpine

# Install build dependancies.
RUN apk --no-cache add git python

# Create app directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup the environment for production.
ENV NODE_ENV production

# Bundle application source.
COPY . /usr/src/app

# Store the current git revision.
ARG REVISION_HASH
RUN mkdir -p dist/core/common/__generated__ && \
  echo "{\"revision\": \"${REVISION_HASH}\"}" > dist/core/common/__generated__/revision.json

# Install build static assets and clear caches.
RUN NODE_ENV=development npm install && \
  npm run generate && \
  npm run build && \
  npm prune --production

# Setup the environment
ENV PATH /usr/src/app/bin:$PATH
ENV PORT 5000
EXPOSE 5000
ENV NODE_ENV production

CMD ["npm", "run", "start"]
