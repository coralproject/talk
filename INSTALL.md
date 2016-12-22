# BUILDING FROM SOURCE

By contributing to this project you agree to the [Code of Conduct](https://coralproject.net/code-of-conduct.html).

## Requirements

* [Node](https://nodejs.org/es/download/package-manager)
* Mongo
* Redis
*
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

	export TALK_PORT=5000
	export TALK_MONGO_URL=mongodb://localhost/talk
	export TALK_REDIS_URL=redis://redis/talk
	export TALK_SESSION_SECRET=somethingsecret
	export TALK_FACEBOOK_APP_ID=fbidapp_youneeditforfbconnect
	export TALK_FACEBOOK_APP_SECRET=fbappsecret_youneeditforfbconnect
	export TALK_ROOT_URL=http://localhost:5000
	export TALK_SMTP_USERNAME=coralproject
	export TALK_SMTP_PASSWORD=smtppassword
	export TALK_SMTP_HOST=smtp.example.net
	export TALK_SMTP_PROVIDER=Example

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
