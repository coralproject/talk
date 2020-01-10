FROM node:12-alpine

# Install build dependancies.
RUN apk --no-cache add git python

# Create app directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle application source.
COPY . /usr/src/app

# Store the current git revision.
ARG REVISION_HASH
RUN mkdir -p dist/core/common/__generated__ && \
  echo "{\"revision\": \"${REVISION_HASH}\"}" > dist/core/common/__generated__/revision.json

# Install build static assets and clear caches.
RUN npm ci && \
  npm run build && \
  npm prune --production

# Setup the environment
ENV NODE_ENV production
ENV PORT 5000
EXPOSE 5000

CMD ["npm", "run", "start"]
