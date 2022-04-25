---
title: Migrating from v6.x to v7+
---

Coral v7 includes a major change in the technology underlying the stream embed. Previous versions of Coral rendered the stream within an iframe embedded on the parent page, providing encapsulation and isolation from the parent page. Modern browsers have recently been targeting iFrame embeds with performance and usability penalties, so Coral v7 instead relies on [Shadow DOM encapuslation](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to render the stream to the parent page. In addition to avoiding performance penalties, replacing the iFrame will also enable further improvements to the performance and usability of the stream embed, which are currently being worked on.

## Breaking Changes

- Minimum browser requirements have changed: Coral 7.0.0 will only work in browser that support the Shadow DOM API, which includes all currently supported versions of Chrome, Firefox, Safari, and Edge. Coral 7.0.0 is not compatible with Internet Explorer 11.
- Custom font declarations must now be referenced in a new "Custom CSS Stylesheet URL for Font Faces" field
- Custom CSS targeting `body`, `html` or `:root` will no longer work, as Coral no longer renders a full HTML document

## Migration steps

1. Create a new stylesheet for any `@font-face` declarations and specify the URL to this file in the new "Custom CSS Stylesheet URL for Font Faces" field under **Configuration > Advanced > Custom CSS**
2. Change the selector for any custom styles targeting `body`, `html`, or `:root` with the selector `#coral`

If you do not complete these steps before updating to v7, your stream will still render functionally, but the appearance may change unexpectedly depending on your custom CSS.
