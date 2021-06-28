---
title: Accelerated Mobile Pages
---

[AMP](https://amp.dev/) is a light-weight, stripped down HTML page that aims to improve reader experience. Coral comes with [AMP](https://amp.dev/) support.

## Enable AMP Support

Go to _Advanced Section_ in _Configure_ and enable _Accelerated Mobile Pages_.

<blockquote>
  Note: With AMP enabled, the embed won't be protected by the <code>frame-ancestors</code> <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors">(MDN)</a>
  <span> header</span> and relies on <code>X-Frame-Options</code> <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options">(MDN)</a>
  <span> instead</span>.
</blockquote>

## How to integrate

Put the following code into your _AMP_ page and replace `{{ CORAL_DOMAIN_NAME }}` and `{{ CORAL_STORY_URL }}` with the
corresponding values. You can also pass `storyID` instead of `storyURL` by using `?storyID={{ CORAL_STORY_ID }}`.

```html
<amp-iframe
  width=600 height=360
  layout="responsive"
  sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms"
  resizable
  src="https://{{ CORAL_DOMAIN_NAME }}/embed/stream/amp?storyURL={{ CORAL_STORY_URL }}">
  <div placeholder></div>
  <div overflow tabindex=0 role=button aria-label="Read more">Read more</div>
</amp-iframe>
```

## Advanced Integration

If you want to pass additional configuration to `createStreamEmbed`, then you
have to create and host an html page – let's call it `amp.html` – with the following
output and replace `{{ CORAL_DOMAIN_NAME }}` with the appropriate values.

This page is then used in `src` of `<amp-iframe>` above. It must be accessed over `https`
and live on a different domain than the `amp` page. For example: `src="https://{{ MY_AMP_PAGE }}?storyURL={{ CORAL_STORY_URL }}"`.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Coral – AMP Embed Stream</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width" />
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="coralStreamEmbed"></div>
    <script src="https://{{ CORAL_DOMAIN_NAME }}/assets/js/embed.js"></script>
    <script>
      Coral.createStreamEmbed({
        id: "coralStreamEmbed",
        rootURL: "https://{{ CORAL_DOMAIN_NAME }}",
        autoRender: true,
        amp: true,
      });
    </script>
  </body>
</html>
```

### Single Sign On

In the page created by following the _Advanced Integration_ section, you'll need to
inject your SSO auth scripts to get the `{{ SSO_TOKEN }}` for the current user. Integrating
with [amp-access](https://amp.dev/documentation/components/amp-access) is recommended
which opens a 1st-party popup to not have browsers block your cookies.

Then you just pass `accessToken: {{ SSO_TOKEN }}` to the `createStreamEmbed` method.
