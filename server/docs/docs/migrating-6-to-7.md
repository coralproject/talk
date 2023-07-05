---
title: Migrating from v6.x to v7+
---

Coral v7 includes a major change in the technology underlying the stream embed. Previous versions of Coral rendered the stream within an iframe embedded on the parent page, providing encapsulation and isolation from the parent page. Modern browsers have recently been targeting iFrame embeds with performance and usability penalties, so Coral v7 instead relies on [Shadow DOM encapuslation](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to render the stream to the parent page. In addition to avoiding performance penalties, replacing the iFrame will also enable further improvements to the performance and usability of the stream embed, which are currently being worked on.

## Breaking Changes

- Minimum browser requirements have changed: Coral 7.0.0 will only work in browser that support the Shadow DOM API, which includes all currently supported versions of Chrome, Firefox, Safari, and Edge. Coral 7.0.0 is not compatible with Internet Explorer 11.
- Custom font declarations must now be referenced in a new "Custom CSS Stylesheet URL for Font Faces" field
- Custom CSS targeting `body`, `html` or `:root` will no longer work, as Coral no longer renders a full HTML document
- the property `bodyClassName` in the `createStreamEmbed` options has been changed to `containerClassName`
- All network requests will now originate in the main page context instead of inside the iframe, this may cause problems if you have a strict [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). Test Coral v7 in a staging environment to be sure. You may need to whitelist Coral URLs in your Content Security Policy.

## How to update from Coral v6.18 to v7 without losing your styling

The update requires updates to your stylesheets and configuration. In order to prevent any missing styles or fonts during the update process, you can preemptively update your CMS to support both the old (6.18) and new (7.x.x) versions of Coral at the same time, allowing for a more seamless update. Once the update is complete, you may remove the code that supports the older version.

**If you forgo these steps and update your CMS after the update to v7, there will be a period between the Coral update and your CMS update during which your comments stream may appear unstyled or styled incorrectly, though it will still function.**

1. If your custom CSS contains any custom fonts (via `@font-face` declarations), you will need to create a new CSS file containing just the font-face declarations. Update your embed code to include the new `customFontsCSSURL` property to point to the URL for this CSS file.
2. Update your custom CSS file and for any rule that targets `:root`, `html`, or `body`, duplicate that rule and change the selector to `#coral`. For example, the following custom CSS:

```css
:root {
  --font-family-primary: Georgia;
  --font-family-secondary: Helvetica;
}

body,
html {
  background: blue;
}
```

Would need to be updated to:

```css
:root {
  --font-family-primary: Georgia;
  --font-family-secondary: Helvetica;
}

body,
html {
  background: blue;
}

#coral {
  background: blue;
  --font-family-primary: Georgia;
  --font-family-secondary: Helvetica;
}
```

3. If you specify a `bodyClassName` property in the `createStreamEmbed` options, you will need to replace it with the new property `containerClassName`

4. If your site has a Content Security Policy that prohibits websocket (`wss://`) requests, you will need to update it to whitelist `wss://[your coral URL]/api/graphql/live` in order for live updates to function.

## After Coral has been updated to v7

Once the update is complete and you are running v7, you may wish to undo some of the previous steps for better maintainability:

1. If desired, you can specify the new custom fonts CSS URL through the admin at **Configure > Advanced > Custom CSS Stylesheet URL for Font Faces**. Once you have added the URL to this field you can remove the `customFontsCSSURL` property from your embed code
2. You may now remove any rules targeting `body`, `html`, and `:root` from your custom CSS file
