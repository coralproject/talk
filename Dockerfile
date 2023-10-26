FROM node:14-alpine AS builder

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

# Initialize sub packages
RUN cd config && npm ci && \
  cd ../common && npm ci && \
  cd ../client && npm ci && \
  cd ../server && npm ci && \
  cd ..

# Generate schema types for common/ to use
RUN cd server && \
  npm run generate && \
  cd ..

# Build config, prune static assets
RUN cd config && \
  npm run build && \
  cd ..

# Build common, prune static assets
RUN cd common && \
  npm run build && \
  cd ..

# Build client, prune static assets
RUN cd client && \
  npm run build && \
  npm prune --production && \
  cd ..

# Install, build server, prune static assets
RUN cd server && \
  npm run build && \
  npm prune --production && \
  cd ..

FROM node:14-alpine AS runner
COPY --from=builder . .

# Set working directory within server folder
WORKDIR /usr/src/app/server

# Setup the environment
ENV NODE_ENV production
ENV PORT 5000
EXPOSE 5000

# Run the node process directly instead of using `npm run start`:
# SEE: https://github.com/nodejs/docker-node/blob/a2eb9f80b0fd224503ee2678867096c9e19a51c2/docs/BestPractices.md#cmd
CMD ["node", "dist/index.js"]
