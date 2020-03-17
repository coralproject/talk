---
title: Accelerated Mobile Page
permalink: /integrating/amp/
---

[AMP](https://amp.dev/) is a light-weight, stripped down HTML page that aims to improve reader experience. _Talk v4.9.0+_ comes with  [AMP](https://amp.dev/) support. The current caveat however is that _toast notifications_ are not being rendered when viewing inside AMP.

# How to integrate
Put the following code into your _AMP_ page and replace `$TALK_URL` and `$ASSET_URL` with the
corresponding values. You can also pass `asset_id` instead of `asset_url`.

```html
<amp-iframe
  width=600 height=140
  layout="responsive"
  sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms"
  resizable
  src="https://$TALK_URL/embed/amp#asset_url=$ASSET_URL">
  <div placeholder></div>
  <div overflow tabindex=0 role=button aria-label="Read more">Read more</div>
</amp-iframe>
```

## Single Sign-On
For SSO integration you need to create a page with the following output and replace `$TALK_URL` and `$AUTH_TOKEN` with the appropriate values. Inject your SSO auth scripts to get the  `$AUTH_TOKEN` for the current user. Integrating with [amp-access](https://amp.dev/documentation/components/amp-access) is recommended which opens a 1st-party popup to not have browsers block your cookies. This page is then used in `src` of `<amp-iframe>` above. It must be accessed over `https` and live in a different domain than the `amp` page.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <title>Coral Talk Amp Embed</title>
  </head>
  <body>
    <div id='coralStreamEmbed'></div>
    <script src="https://$TALK_URL/static/embed.js"></script>
    <script>
      window.TalkEmbed = Coral.Talk.render(document.getElementById('coralStreamEmbed'), {
        talk: '$TALK_URL',
        auth_token: '$AUTH_TOKEN',
        amp: true,
      })
    </script>
  </body>
</html>
```
