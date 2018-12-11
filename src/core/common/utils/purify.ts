import newDOMPurify, { DOMPurify } from "dompurify";

export function createPurify(window: Window) {
  // Initializing JSDOM and DOMPurify
  const purify = newDOMPurify(window);

  // Setting our DOMPurify config.
  purify.setConfig({
    // Only forward anchor tags, bold, italics, blockquote, breaks, divs, and
    // spans.
    ALLOWED_TAGS: ["a", "b", "i", "blockquote", "br", "div", "span"],
    // Only allow href tags for anchor tags.
    ALLOWED_ATTR: ["href"],
    // Always return the DOM to the caller of sanitize.
    RETURN_DOM: true,
  });

  // Ensure that each anchor tag has a "target" and "rel" attributes set, and
  // strip the "href" attribute from all non-anchor tags.
  purify.addHook("afterSanitizeAttributes", node => {
    if (node.nodeName === "A") {
      // Ensure we wrap all the links with the target + rel set.
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    } else {
      // The only tag that's allowed attributes is the "A" tag.
      node.removeAttribute("href");
    }
  });

  return purify;
}

export function sanitizeCommentBody(purify: DOMPurify, source: string) {
  // Sanitize and return the HTMLBodyElement for the parsed source.
  const sanitized = purify.sanitize(source);

  // Count the total number of anchor links in the sanitized output, this is the
  // number of links.
  const linkCount = sanitized.getElementsByTagName("a").length;

  return {
    body: sanitized.innerHTML,
    linkCount,
  };
}
