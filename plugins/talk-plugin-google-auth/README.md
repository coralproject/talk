---
title: talk-plugin-google-auth
permalink: /plugin/talk-plugin-google-auth/
layout: plugin
plugin:
    name: talk-plugin-google-auth
    depends:
        - name: talk-plugin-auth
    provides:
        - Server
        - Client
---

Enables sign-in via Google+ via the server side passport middleware.

You will need to enable the Google+ API in the dashboard and create credentials
for a new OAuth client ID web application. The authorized JavaScript origin
should be set to the Talk domain, and the authorized redirect URI should be set
to http://<example.com>/api/v1/auth/google/callback. This is only required while
the `talk-plugin-google-auth` plugin is enabled.

Configuration:

- `TALK_GOOGLE_CLIENT_ID` (**required**) - The Google OAuth2 client ID for your
  Google login web app. You can learn more about getting a Google Client ID at
  the [Google API Console](https://console.developers.google.com/apis/).
- `TALK_GOOGLE_CLIENT_SECRET` (**required**) - The Google OAuth2 client ID for
  your Google login web app. You can learn more about getting a Google Client
  ID at the [Google API Console](https://console.developers.google.com/apis/).
