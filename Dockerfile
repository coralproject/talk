FROM node:18-alpine

ENV NODE_OPTIONS="--max-old-space-size=8192 --openssl-legacy-provider --no-experimental-fetch"

# Install build dependancies.
RUN apk --no-cache --update add g++ make git python3 \
  && rm -rf /var/cache/apk/*

RUN npm install -g pnpm@8.14.3

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

# Initialize sub packages
RUN cd config && pnpm install --frozen-lockfile && \
  cd ../common && pnpm install --frozen-lockfile && \
  cd ../client && pnpm install --frozen-lockfile && \
  cd ../server && pnpm install --frozen-lockfile && \
  cd ..

# Generate schema types for common/ to use
RUN cd server && \
  pnpm run generate && \
  cd ..

# Build config, prune static assets
RUN cd config && \
  pnpm run build && \
  cd ..

# Build common, prune static assets
RUN cd common && \
  pnpm run build && \
  cd ..

# Build client, prune static assets
RUN cd client && \
  pnpm run build && \
  pnpm prune --production && \
  cd ..

# Install, build server, prune static assets
RUN cd server && \
  pnpm run build && \
  pnpm prune --production && \
  cd ..

# Set working directory within server folder
WORKDIR /usr/src/app/server

# Setup the environment
ENV NODE_ENV production
ENV PORT 5000
EXPOSE 5000

# Run the node process directly instead of using `pnpm run start`:
# SEE: https://github.com/nodejs/docker-node/blob/a2eb9f80b0fd224503ee2678867096c9e19a51c2/docs/BestPractices.md#cmd
CMD ["node", "dist/index.js"]
