FROM node:14-alpine

ENV NODE_OPTIONS=--max-old-space-size=8192

# Install build dependancies.
RUN apk --no-cache add git python3

RUN npm install -g npm@8.0.0

# Create app directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle application source.
COPY . /usr/src/app

# Store the current git revision.
ARG REVISION_HASH
RUN mkdir -p dist/core/common/__generated__ && \
  echo "{\"revision\": \"${REVISION_HASH}\"}" > dist/core/common/__generated__/revision.json

# Run all application code and dependancy setup as a non-root user:
# SEE: https://github.com/nodejs/docker-node/blob/a2eb9f80b0fd224503ee2678867096c9e19a51c2/docs/BestPractices.md#non-root-user
RUN chown -R node /usr/src/app
USER node

# Node alpine image does not include ssh. This is a workaround for https://github.com/npm/cli/issues/2610.
RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/ && \
    git config --global url."https://".insteadOf ssh://

# Install build static assets and clear caches.
RUN npm ci && \
  npm run build && \
  npm prune --production

# Setup the environment
ENV NODE_ENV production
ENV PORT 5000
EXPOSE 5000

# Run the node process directly instead of using `npm run start`:
# SEE: https://github.com/nodejs/docker-node/blob/a2eb9f80b0fd224503ee2678867096c9e19a51c2/docs/BestPractices.md#cmd
CMD ["node", "dist/index.js"]
