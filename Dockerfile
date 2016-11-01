FROM node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup the environment
ENV PATH /usr/src/app/bin:$PATH
EXPOSE 5000

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Compile static assets
# RUN npm run build

# Prune development dependancies
RUN npm prune --production

CMD [ "npm", "start" ]
