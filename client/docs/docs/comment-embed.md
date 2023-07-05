---
title: Comment Embed
---

Add the `commentEmbed.js` script to your `html` tree. On a page that includes the _Stream Embed_ this is done for you automatically, however for best performance we recommend to include it into the `<head>` tag.

```html
<script
  class="coral-script"
  src="//{{ CORAL_DOMAIN_NAME }}/assets/js/commentEmbed.js"
  defer
></script>
```

If you are manually including the embed script, and you want to set a `customCSSURL` and a `customFontsCSSURL` to use instead or in place of tenant settings for these values, include these as data attributes on the script for the single comment embed to use. If the script is automatically added by the _Stream Embed_, these values will be grabbed and set for you.

Example of how to manually add them:

```html
<script
  class="coral-script"
  src="//{{ CORAL_DOMAIN_NAME }}/assets/js/commentEmbed.js"
  data-customCSSURL="{{ CUSTOM_CSS_URL }}"
  data-customFontsCSSURL="{{ CUSTOM_FONTS_CSS_URL }}"
  defer
></script>
```

> **NOTE:** Replace the value of `{{ CORAL_DOMAIN_NAME }}` with the location of your running instance of Coral.

### Embed code

To get the embed code for a comment, go to the comment in the stream and click to open the moderation options dropdown. Click `Embed code`, and this will copy the code to your clipboard. Paste the embed code where you want to embed the comment. It will look something like this:

```html
<div
  class="coral-comment-embed"
  style="background-color: #f4f7f7; padding: 8px;"
  data-commentID="COMMENT_ID"
  data-allowReplies="true"
  data-reactionLabel="Respect"
>
  <div style="margin-bottom: 8px;">username</div>
  <div><div>This is a comment.</div></div>
</div>
```

After successful injection, it includes a shadow dom with the full comment embed inside of it.

### Custom styles

Any custom CSS and CSS Font Faces stylesheets that are configured in the `Advanced` admin configuration section will be used to style the comment embed.

The comment embed uses the same [CSS classes](https://github.com/coralproject/talk/blob/develop/src/core/client/stream/classes.ts) that are available to style any comment in the stream. The comment embed also includes a `coral-comment-embed-container` class that can be used to style it specifically.

### Advanced configuration

You can configure your comment embed using `data-*` attributes as needed. The available `data-*` attributes are:

- data-allowReplies

When set to `"true"`, a reply button will appear with the embedded comment to encourage additional discussion on that specific comment or story. When set to `"false"`, reply buttons will not appear. When `data-allowReplies` is not present, it will default to what is configured under the `Advanced` admin configuration section for `Embedded comment replies`.

- data-reactionLabel

If you would like to provide a custom reaction label to use for the comment's reaction button.

### Using Oembed

You can also use our Oembed API endpoint to embed comments. To do so, call the endpoint `/api/services/oembed`.

The Oembed endpoint accepts 4 query parameters:

- url - required

This should be the url for the comment's permalink. This is the url that is copied when you click `Share` on a comment in the stream.

- allowReplies - optional

When set to true, a reply button will appear with the embedded comment to encourage additional discussion on that specific comment or story. When set to false, reply buttons will not appear.

- format - optional

Only JSON format is currently supported.

- reactionLabel - optional

If you would like to provide a custom reaction label to use for the comment's reaction button.

The Oembed endpoint returns:

- html

The full comment embed html including any default or custom CSS.

- simpleCommentEmbedHtml

The simple comment embed html includes the comment's text, comment author's username, and the CSS class that the `commentEmbed.js` script uses to inject the full comment embed within a shadow dom on your page.

- embeddedMediaIframeScript

If you are embedding a comment that includes embedded media (Twitter, Youtube, external media image), you will need to add a script to set the correct height for the embed. A message is already being posted via `postMessage` from the embedded media iframe in the Coral comment. An example of how this might be added can be found in `https://github.com/coralproject/talk/tree/develop/src/core/client/oembed/commentEmbed.html`. To support the embedded media height with this iframe script, you will need to attach the comment embed via shadow dom to an element with the id of `coral-comment-embed-shadowRoot-COMMENT_ID`.

You will not need to add this script if you are using the Oembed API to add the `simpleCommentEmbedHtml` to your page to work with `commentEmbed.js` injection. The injection script will add the needed iframe script in this case.

- width

Recommended width for the embed.

- height

Recommended height for the embed.
