---
title: Authenticating with Talk
permalink: /integrating/authentication/
---

You can integrate Talk with any external authentication service that will enable
seamless single sign-on for users within your organization. There are a few
methods of doing so:

1. Passport Middleware
2. Custom Token Integration

Both methods work, but there are product decisions that will affect the overall
choice.

## Passport Middleware

You would choose the **Passport Middleware** route when you are OK using an auth
that is triggered from inside Talk that is not connected to an external auth
state (you don't use the auth anywhere else now). A great example of this is our
[talk-plugin-facebook-auth](/talk/plugin/talk-plugin-facebook-auth/) plugin.

## Custom Token Integration 

You can integrate Talk with any authentication service to enable single sign-on
for users. The steps to do that are:

1. Create a service that generates [JWT tokens](https://jwt.io).
2. Push the token into the embed.
3. Implement the `tokenUserNotFound` hook to process the token.

### Create JWT Token

You should create an external service that is responsible for generating a JWT
for use with Talk. The token can be generated as easy as checking out the
following node app: https://github.com/coralproject/talk-token-example

Using that demo application, you'll see how you can:

1. Create a node application that can issue JWT's that are compatible with Talk.
2. Provide a validation endpoint that can be used by Talk to validate the token
   and get the user via the `tokenUserNotFound` hook.

### Push token into embed

We're assuming that your CMS is capable of authenticating a user account, or 
at least having the user's details available to send off to the token creation
service we created/used in the previous step.

Using the token that was created for the user, you simply have to ammend the template where Talk is rendering to read as the following:

```js
Coral.Talk.render(document.getElementById('coralStreamEmbed'), {
    // ...
    auth_token: '<your generated JWT token issued for this user>',
});
```

Which will pass down the token to Talk and will fire the next steps
`tokenUserNotFound` hook to complete the auth flow.

### Implement `tokenUserNotFound`

This is the only piece of code you'll have to write that lives inside Talk. 
The role of this code is to live as a plugin and provide Talk with a way of
taking the token that you gave it, and turning into a user.

Using the example application we were working with in the JWT issuing step
above, we'll need to ensure that the configuration is consistent in-between both
Talk and the JWT issuer. Namely, the following environment variables from our
example issuer and Talk must match:

| Talk | Token Issuer Example |
|------|----------------------|
|`JWT_ISSUER`|`JWT_ISSUER`|
|`JWT_AUDIENCE`|`JWT_AUDIENCE`|
|`SECRET`|`JWT_SECRET`*|

\* Note that secrets is a pretty complex topic, refer to the
[TALK-JWT-SECRET](/talk/advanced-configuration/#TALK-JWT-SECRET) configuration
reference, the basic takeaway is that the secret used to sign the tokens issued
by the issuer must be able to be verified by Talk.

For an example of implementing the plugin, refer to [`tokenUserNotFound`](/talk/api/server/#tokenusernotfound)
reference.
