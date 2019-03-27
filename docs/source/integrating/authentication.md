---
title: Authenticating with Talk
permalink: /integrating/authentication/
---

Talk comes with built in user management features like account registration with username/email and password, as well as features like resetting a forgotten password. 

## There are four strategies to choose from when it comes to user authentication:

### Talk Email Authentication
Best when you want Talk to manage all user registration, creation and authentication. Requires the least amount of setup and configuration. Users register by creating a Username (must be unique across users, no spaces or special chars), Email, and Password and are stored in Talk’s database. Optionally - you can require an email verification step at time of account creation. *Plugins required: `talk-plugin-local-auth`, `talk-plugin-auth`*

### Social Sign-in (FaceBook or Google via Passport Middleware)

Allows users to use existing social media account to sign in to Talk. Requires you to setup API keys with social sign on provider, and configure your API keys in Talk. Users register and login via a *“Sign in with ….”*, but are not required to set user details such as password or email address. *Plugins required: `talk-plugin-auth`, plus at least one of the following:*

* [Facebook](/talk/plugin/talk-plugin-facebook-auth/)
* [Google](/talk/plugin/talk-plugin-google-auth/) 

_FAQ: Can I create a Twitter auth plugin?_ 
This is currently not possible because Talk uses passport.js which does not support Twitter's oAuth2 requirements.

### Social Sign-in with Email Association 
This strategy is actually a combination of the first two. Talk’s built in Email Authentication is augmented by also allowing registration with a social account. Users with social accounts are prompted to associate an email address with their social profile to enable notifications. *Plugins required: `talk-plugin-auth`, `talk-plugin-local-auth`, `talk-plugin-facebook-auth`, and or `talk-plugin-google-auth`*

### Custom SSO Token Integration
When you want users to authenticate via your existing identity system, and be automatically registered/logged into Talk. Users register, login, and manage their user details on your existing site, your user database maintains the source of truth for all user information. Users are created and updated in Talk via jwt tokens passed from your auth service to Talk. *Required Plugins: requires custom plugin development, as well as disabling talk-plugin-auth, and talk-plugin-local-auth*



## Setting Up Custom SSO Token Integration

You can integrate Talk with any authentication service to enable single sign-on
for users. The steps to do that are:

1. Create a service that generates [JWT tokens](https://jwt.io/introduction/).
2. Include the JWT token in your Talk embed script
3. Create a custom plugin to generate and authenticate Talk users from the jwt token

### Create JWT Token

You should create an external service that is responsible for generating a JWT
for use with Talk. The token can be generated as easy as checking out the
following node app: https://github.com/coralproject/talk-token-example

Using that demo application, you'll see how you can:

1. Create a node application that can issue JWT's that are compatible with Talk.
2. Provide a validation endpoint that can be used by Talk to validate the token
   and get the user via the [`tokenUserNotFound`](#implement-tokenusernotfound)
   hook.

It's also important to note a few requirements for proper integration with Talk.
The generated JWT must contain the following claims:

- [`jti`](https://tools.ietf.org/html/rfc7519#section-4.1.7): a unique identifier for the token (like a uuid/v4)
- [`exp`](https://tools.ietf.org/html/rfc7519#section-4.1.4): the expiry date of the token as a unix timestamp
- [`sub`](https://tools.ietf.org/html/rfc7519#section-4.1.2): the user identifier that can be used to lookup the user in the mongo
  database
  - The user may not yet exist in the database, but that's the responsibility
    of the [`tokenUserNotFound`](#implement-tokenusernotfound) hook.
- [`iss`](https://tools.ietf.org/html/rfc7519#section-4.1.1): the issuer for the token must match the value of `TALK_JWT_ISSUER`
- [`aud`](https://tools.ietf.org/html/rfc7519#section-4.1.3): the audience for the token must match the value of `TALK_JWT_AUDIENCE`

### Generate a key to sign the JWT
Optionally you can use https://github.com/coralproject/coralcert to generate a key with which to sign the JWTs and specify the secret as an environment variable. 

### Include token in embed

We're assuming that your CMS is capable of authenticating a user account, or 
at least having the user's details available to send off to the token creation
service we created/used in the previous step.

Using the token that was created for the user, you simply have to amend the
template where Talk is rendering to read as the following:

```js
Coral.Talk.render(document.getElementById('coralStreamEmbed'), {
    // ...
    auth_token: '<your generated JWT token issued for this user>',
});
```

Which will pass down the token to Talk and will fire the 
`tokenUserNotFound` hook to complete the auth flow.

### Create a Custom Plugin to Generate Talk Users 

This is the only piece of code you'll have to write that lives inside Talk. 
The role of this code is to live as a plugin and provide Talk with a way of
taking the token that you gave it, and turning into a user.

Using the example application we were working with in the JWT issuing step
above, we'll need to ensure that the configuration is consistent in-between both
Talk and the JWT issuer. Namely, the following environment variables from our
example issuer and Talk must match:

| Talk | Token Issuer Example |
|------|----------------------|
|[`TALK_JWT_ISSUER`](/talk/advanced-configuration/#talk-jwt-issuer)|`JWT_ISSUER`|
|[`TALK_JWT_AUDIENCE`](/talk/advanced-configuration/#talk-jwt-audience)|`JWT_AUDIENCE`|
|[`TALK_JWT_SECRET`](/talk/advanced-configuration/#talk-jwt-secret)|`JWT_SECRET`*|

\* Note that secrets is a pretty complex topic, refer to the
[TALK_JWT_SECRET](/talk/advanced-configuration/#talk-jwt-secret) configuration
reference, the basic takeaway is that the secret used to sign the tokens issued
by the issuer must be able to be verified by Talk.

For an example of implementing the plugin, refer to [`tokenUserNotFound`](/talk/api/server/#tokenusernotfound)
reference.
