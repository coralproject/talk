---
title: Setup Development Environment
keywords: homepage
sidebar: talk_sidebar
permalink: /setup-development-environment.html
summary:
---
## Talk development environment:
* Docker for Mongo + Redis
* Source for running Talk

##  [Installation From Source]({% link install-source.md %})


TODO: intergate this into Installation from source! 
“But there is also a ```plugins.default.json``` you could use at the beginning.”

## Running in development mode using ‘.env’ file
In a CLI with node set to node 7.8 e.g. with nvm.
```
$ yarn dev-start
Error: ENOENT: no such file or directory, open ‘.env’
```
creat ‘.env’ file then
```
$ yarn dev-start
Error: Facebook cannot be enabled, missing one of TALK_FACEBOOK_APP_ID, TALK_FACEBOOK_APP_SECRET, TALK_ROOT_URL
```
edit ‘.env’ like this sample

Sample .env file as in more detail documented in [Configuration]({% link configuration.md %}).

```
TALK_MONGO_URL=mongodb://127.0.0.1:27017/talkdb
TALK_REDIS_URL=redis://127.0.0.1:6379
TALK_ROOT_URL=http://localhost

# JSON Web Token
TALK_JWT_SECRET=mySecret

# ReCaptcha
 TALK_RECAPTCHA_SECRET=myRecaptchaSecretKey
 TALK_RECAPTCHA_PUBLIC=myRecaptchaPublicKey

# Facbook Auth
TALK_FACEBOOK_APP_ID=xxxxxxx
TALK_FACEBOOK_APP_SECRET=myfacebooksecret

# Google Mail
# EMAIL seems wrong in the docs in source code 
# TALK_SMTP_EMAIL=max@milian.com
# you will find FROM_ADDRESS
TALK_SMTP_FROM_ADDRESS=max@milian.com
TALK_SMTP_USERNAME=Max Milian
TALK_SMTP_PASSWORD=safePasswort
TALK_SMTP_HOST=smtp.gmail.com
TALK_SMTP_PORT=465
```

#### [JSON Web Token(JWT) settings:](https://jwt.io/introduction/)
Generate a Password for TALK_JWT_SECRET
e.g. [Password Generator](www.grc.com).

#### [ReCaptcha](https://developers.google.com/recaptcha/)

#### [Facbook Auth settings:](https://developers.facebook.com/docs/facebook-login) 

[How To Get An App ID and Secret Key From Facebook](https://goldplugins.com/documentation/wp-social-pro-documentation/how-to-get-an-app-id-and-secret-key-from-facebook/)

[Facebook development in localhost](https://stackoverflow.com/questions/4532721/facebook-development-in-localhost)


## Start the development server
```
$ yarn dev-start
```
watch for changes to client files and build static assets with webpack in another CLI
```
$ yarn build-watch                                                  
yarn build-watch v0.24.6
```
which starts the webpack config, build the modules and sets the Node environment to development mode.

```NODE_ENV=development webpack --progress --config webpack.config.js --watch```

If you now edit and save client files the changes will be reflected in the UI.

## [Setup the application]({% link install-setup.md %})  


## Application Configuration

TODO: create link 

## [GraphQL API]({% link graphql-api.md %}) 
Explore the GraphQL API with GraphiQL


