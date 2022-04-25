---
title: Customizing Styles with CSS
sidebar_label: Custom CSS
---

Coral uses [Shadow DOM Encapsulation](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) to isolate the styling context from the parent page, therefore any CSS on the parent page will not apply to the embed.

You can add your own stylesheet to customize Coral in **Admin** > **Configure** > **Advanced** > **Custom CSS**. Use a separate stylesheet to import custom fonts via @font-face, and add it in **Admin** > **Configure** > **Advanced** > **Custom Fonts CSS**.

### Use CSS Variables

We recommend using CSS Variables to broadly apply changes to certain styling aspects like color or fonts.

Here is a CSS example that modifies some of the CSS Variables.

```css
#coral {
  /* Change primary font */
  --font-family-primary: "Verdana";

  /* Remove round corners */
  --round-corners: 0px;
}
```

You can find all CSS Variables using the Web Inspector or navigate to https://github.com/coralproject/talk/blob/main/CSS_VARIABLES.md for a comprehensive list and additional information.

> **NOTE:** Before 6.3.0 Coral uses a different set of CSS Variables. Navigate to the link above to get information on upgrading.

### Use stable CSS Class Names

If you would like to change the styling of any elements of the comment embed, we provide global class names. Most elements will be tagged with either `.coral` or `.coral-stream`.

The easiest way to find the class name for the element you're looking for is to use the web inspector, and then update your stylesheet accordingly.

You can also navigate to https://github.com/coralproject/talk/blob/main/src/core/client/stream/classes.ts to see available stable class names.

### Custom container class for theming

You can set the class name of the container inside the embed by using the `containerClassName` parameter when calling `Coral.createStreamEmbed`:

```js
Coral.createStreamEmbed({
  containerClassName: "pink",
});
```

This will allow your styles to include variations:

```css
.pink button.coral {
  background: pink;
}
```

### Container styling

To style the outermost container of the Coral embed, target the `#coral` selector.

### Reaction styling

As of Coral 6.3.0, Coral has support for styling based on the number of
reactions that a given comment has received. It does so via the:

```css
.coral-reacted-{{ n }}
```

Where `{{ n }}` is the number of reactions the comment has received. You can
invert this when creating CSS to allow you to highlight comments that have at
least `{{ n }}` reactions. For example, if you wanted to add a coral color to
comments with at least 3 reactions, you could write:

```css
.coral-comment .coral-indent {
  background-color: coral;
}

.coral-reacted-0 .coral-indent,
.coral-reacted-1 .coral-indent,
.coral-reacted-2 .coral-indent {
  background-color: transparent;
}
```
