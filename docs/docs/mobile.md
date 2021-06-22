---
title: Integrating on your native mobile application
sidebar_label: Native Mobile Apps
---

Integration with native mobile applications is done through web view, you will need to host an HTML page which contains your embed code and open a web view to this page. There are many approaches to integrating native and web applications across different mobile operating systems, but any integration will involve the following steps:

1. Host your embed code (find your **Embed code** under **Configure** > **Organization** > **Site Details**) in an HTML page served over HTTPS. For example, `https://yoursitename.com/coral.html`
2. Add the domain to the list of permitted domains for your site under **Configure** > **Organization** > **Site Details**
3. Create a web view in your native application which points to this URL
4. Pass an SSO access token through to the embed code to log in your user. See [Single Sign On](/sso) for information on how to generate an SSO token. There are multiple ways to pass data from a native application to a web view, one method is to encode the access token in a query parameter on the URL hash (ex. `https://yoursitename.com/coral.html#accessToken=ssoToken`) and retrieve the token from the embed code. You can then pass through the `accessToken` option passed to `createStreamEmbed`:

```js
  const urlParams = new URLSearchParams(window.location.hash.replace("#", "?"));
  const accessToken = urlParams.get("accessToken");

  [...]
  Coral.createStreamEmbed({
      id: "coral_thread",
      autoRender: true,
      accessToken: accessToken
      ...
  });

```

**_note_**: Example URL uses a hash (`#`) instead of question mark (`?`) to prevent access token from being logged.

This will initialize the Coral stream with a logged-in user.

5. You will need to use the same method to pass a Story ID or Story URL to the embed code using the `storyID` or `storyURL` options passed to `createStreamEmbed`. See [CMS Integration](/cms) for more details.
