---
title: Comment Count Integration
permalink: /v5/integrating/counts/
---

With the `count.js` script you can inject comment counts of any story across your page on selected elements.

### Example Usage

Insert an html element with the class `coral-count` and configure it using `data-coral-*` attributes. Finally insert the `count.js` script to the bottom of your `body` tag or insert it to the `head` tag with `defer` turned on.

```html
<head>
  <script href="//{{ CORAL_DOMAIN_NAME }}/assets/js/count.js" defer></script>
</head>
<body>
  <span class="coral-count" data-coral-url="http://example.com/blog-entry-1/"></span>
</body>
```

> **NOTE:** Replace the value of `{% raw %}{{ CORAL_DOMAIN_NAME }}{% endraw %}` with the location of your running instance of Coral.

After successful injection it will become:

```html
<head>
  <script href="//{{ CORAL_DOMAIN_NAME }}/assets/js/count.js" defer></script>
</head>
<body>
  <span class="coral-count" data-coral-url="http://example.com/blog-entry-1/">
    <span class="coral-count-number">5</span>
    <span class="coral-count-text">Comments</span>
  </span>
</body>
```

### Available `data-coral-*` attributes

Set the class of your html element to `coral-count` in order to get story counts. The following `data-coral-*` attributes will configure the output:

- `data-coral-id` – The id of the story of which counts should be injected.
- `data-coral-url` – The url of the story of which counts should be injected.
- `data-coral-notext` – If set to `"true"`, only the count number will be injected

Either `data-coral-id` or `data-coral-url` should be set. If none are provided the story url
will be retrieved from the [canonical url reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Choosing_between_www_and_non-www_URLs#Using_%3Clink_relcanonical%3E) `<link rel="canonical" href="...">` or inferred using the current page url.
