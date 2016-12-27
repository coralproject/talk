# Installing a dev environment

By contributing to this project you agree to the [Code of Conduct](https://coralproject.net/code-of-conduct.html).

## Requirements

### System

- Any flavor of Linux, OSX or Windows
- 1GB memory (minimum)
- 5GB storage (minimum)

### Software

* [Node](https://nodejs.org/es/download/package-manager) v7 or later
* Mongo v3.2 or later
* Redis v3.2 or later 

_Please be sure to check the versions of these requirements. Insufficient versions of these may lead to unexpected errors!_

## First time setup

### Installation

Navigate to a directory.

```
git clone https://github.com/coralproject/talk
cd talk
npm install
```

### Environmental Variables

Talk uses environmental variables for configuration. You can learn about them in the [README file](README.md).


## Workflows

### The server

Starting the server:

```
npm start
```

Browse to `http://localhost:3000` (or your custom port.)

### Building the front end

Our build process will build all front end components registered [here](https://github.com/coralproject/talk/blob/6052cac1d3494f8060325a88bb2ce03c88c2f94c/webpack.config.dev.js#L9-L15).

One time build:

```
npm build
```

Build, then rebuild when a file is updated (development build):

```
npm build-watch
```


### Testing

Run all tests once:

`
npm test
`

Run our end to end tests (will install Selenium and nightwatch):

`
npm run e2e
`

_Please ensure all tests are passing before submitting a PR!_

## Troubleshooting


##### Can't ping the redis server!

- Check that Redis Server is running.
- Check that TALK_REDIS_URL is set.

##### Authenticaiton doesn't work!

- Make sure Redis is the correct version. 


