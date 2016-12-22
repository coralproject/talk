# BUILDING FROM SOURCE

By contributing to this project you agree to the [Code of Conduct](https://coralproject.net/code-of-conduct.html).

## Requirements

* [Node](https://nodejs.org/es/download/package-manager)
* Mongo
* Redis

### Operating System

- We recommend hosting [Talk](https://github.com/coralproject/talk) with any flavor of Linux
- 1GB memory (minimum)
- 5GB storage (minimum)

## Initial Setup

### Get the code

Clone the repository:

`
git clone https://github.com/coralproject/talk
`

### Installation

* cd talk
* npm install

### Environmental Variables

This project is using many environmental variables for configuration. You can learn about them in the [README's file](README.md).

### Local development

`
npm start
`

It will run in http://localhost:$PORT


### Testing

Run all tests once via:

`
npm test
`

`
npm run e2e
`

## Troubleshooting


##### Can't ping the redis server!

- Check that Redis Server is running.
- Check that TALK_REDIS_URL is set.
