
# talk-plugin-local-auth
[View Source on GitHub](https://github.com/coralproject/talk/tree/master/plugins/talk-plugin-local-auth/)

```
    name: talk-plugin-local-auth
    default: true
    provides:
        - Server
        - Client
```


This plugin will eventually contain all the local authentication code that is
responsible for creating, resetting, and managing accounts provided locally
through an email and password based login.

## Features

- *Email Change*: Allows users to change their existing email address on their account.
- *Local Account Association*: Allows users that have signed up with an external auth strategy (such as Google) the ability to associate a email address and password for login. **Note: Existing users with external authentication will be prompted to setup a local account when they sign in and when new users create an account.**

## GDPR Compliance

In order to facilitate compliance with the
[EU General Data Protection Regulation (GDPR)](https://www.eugdpr.org/), you
should review our [GDPR Compliance](../03-08-gdpr.html/) guidelines.
