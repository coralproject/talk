---
title: Comment Counts
---

Add the `count.js` script to your `html` tree. On a page that includes the _Stream Embed_ this is done for you automatically, however for best performance we recommend to include it into the `<head>` tag.

```html
<script
  class="coral-script"
  src="//{{ CORAL_DOMAIN_NAME }}/assets/js/count.js"
  defer
></script>
```

> **NOTE:** Replace the value of `{{ CORAL_DOMAIN_NAME }}` with the location of your running instance of Coral.

Insert an html element with the class `coral-count` and configure it using `data-coral-*` attributes.

```html
<span
  class="coral-count"
  data-coral-url="http://example.com/blog-entry-1/"
></span>
```

After successful injection it will become:

```html
<span class="coral-count" data-coral-url="http://example.com/blog-entry-1/">
  <span class="coral-count-number">5</span>
  <span class="coral-count-text">Comments</span>
</span>
```

### Available `data-coral-*` attributes

Set the class of your html element to `coral-count` in order to get story counts. The following `data-coral-*` attributes will configure the output:

- `data-coral-id` – The id of the story of which counts should be injected.
- `data-coral-url` – The URL of the story of which counts should be injected.
- `data-coral-notext` – If set to `"true"`, only the count number will be injected

Either `data-coral-id` or `data-coral-url` should be set. If none are provided the story URL
will be retrieved from the [canonical url reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Choosing_between_www_and_non-www_URLs#Using_%3Clink_relcanonical%3E) `<link rel="canonical" href="...">` or inferred using the current page url.
