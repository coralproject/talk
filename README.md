# Talk [![CircleCI](https://circleci.com/gh/coralproject/talk.svg?style=svg)](https://circleci.com/gh/coralproject/talk)
A commenting platform from The Coral Project. [https://coralproject.net](https://coralproject.net)

## Contributing to Talk

### Product Roadmap
You can view what the Coral Team is working on next here: https://www.pivotaltracker.com/n/projects/1863625

You can view product ideas and our longer term roadmap here: https://trello.com/b/ILND751a/talk

### Local Dependencies
Node
Mongo

### Getting Started
`npm install`
Run it once to install the dependencies.

`npm start`
Runs Talk.

### Configuration

The Talk application requires specific configuration options to be available
inside the environment in order to run, those variables are listed here:

- `TALK_SESSION_SECRET` (*required*) - a random string which will be used to 
secure cookies.
`TALK_FACEBOOK_APP_ID` (*required*) - the Facebook app id for your Facebook
Login enabled app.
`TALK_FACEBOOK_APP_SECRET` (*required*) - the Facebook app secret for your
Facebook Login enabled app.
`TALK_ROOT_URL` (*required*) - root url of the installed application externally 
available in the format: `<scheme>://<host>` without the path.
`TALK_SMTP_PROVIDER` (*required*) - SMTP provider name.
`TALK_SMTP_USERNAME` (*required*) - username of the SMTP provider you are using.
`TALK_SMTP_PASSWORD` (*required*) - password for the SMTP provider you are using.
`TALK_SMTP_HOST` (*required*) - SMTP host url with format `smtp.domain.com`.
`TALK_SMTP_PORT` (*required*) - SMTP port.

### Running with Docker
Make sure you have Docker running first and then run `docker-compose up -d`

### Testing
`npm test`

### Lint
`npm run lint`

### Helpful URLs
Bare comment stream: http://localhost:5000/client/coral-embed-stream/
Comment stream embedded on sample article: http://localhost:5000/client/coral-embed-stream/samplearticle.html
Moderator view: http://localhost:5000/admin/

### Docs
`swagger.yaml`

### License
**Apache-2.0**
