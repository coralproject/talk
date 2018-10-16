FROM node:8-alpine

# Install build dependancies.
RUN apk --no-cache add git

# Create app directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup the environment for production.
ENV NODE_ENV production

# Bundle application source.
COPY . /usr/src/app

# Install build static assets and clear caches.
RUN NODE_ENV=development npm install && \
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
RUN mkdir dist/core/common/__generated__ && \
  echo "{\"revision\": \"${REVISION_HASH}\"}" > dist/core/common/__generated__/revision.json

CMD ["npm", "run", "start"]
