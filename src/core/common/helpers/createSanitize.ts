import createDOMPurify, { DOMPurifyI } from "dompurify";

import { SPOILER_CLASSNAME } from "coral-common/constants";

const MAILTO_PROTOCOL = "mailto:";

/**
 * Ensure that each anchor tag has a "target" and "rel" attributes set, and
 * strip the "href" attribute from all non-anchor tags.
 */
const sanitizeAnchor = (node: Element) => {
  if (node.nodeName === "A") {
    // Ensure we wrap all the links with the target + rel set.
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");

    // Ensure that all the links have the same link as they do text.
    let href = node.getAttribute("href");
    if (href) {
      if (node.textContent !== href) {
        // remove "mailto:" prefix from link text
        const url = new URL(href);
        if (url.protocol === MAILTO_PROTOCOL) {
          href = href.replace(url.protocol, "");
        }
      }
      node.textContent = href;
    }
  }
};

/**
 * Further restrict the use of attributes.
 */
const sanitizeAttributes = (node: Element) => {
  // Only achor tags can have the `href` attribute.
  if (node.nodeName !== "A" && node.getAttribute("href")) {
    node.removeAttribute("href");
  }
  // Only allow <span class="SPOILER_CLASSNAME"> as our spoiler tag.
  if (node.nodeName === "SPAN" && node.classList.contains(SPOILER_CLASSNAME)) {
    // Remove other classes.
    node.className = SPOILER_CLASSNAME;
  } else {
    node.removeAttribute("class");
  }
};

export const purifyConfig: any = {
  // Only forward anchor tags, bold, italics, blockquote, breaks, divs, and
  // spans.
  ALLOWED_TAGS: [
    "a",
    "b",
    "strong",
    "i",
    "em",
    "blockquote",
    "br",
    "div",
    // TODO: allow spoiler.
    // "span",
    "ul",
    "ol",
    "li",
    // TODO: allow strikethrough.
    // "s",
    "p",
  ],
  ALLOWED_ATTR: [
    // Allow href tags for anchor tags.
    "href",
    // Allow class for spoiler tags.
    "class",
  ],
  ALLOW_DATA_ATTR: false,
  // `ALLOW_ARIA_ATTR` not typed as for v2.0.1.
  ALLOW_ARIA_ATTR: false,
};

export interface SanitizeOptions {
  /** Allow overriding parts of the config */
  config?: any;
  /** normalize makes sure that neighboring text nodes are merged */
  normalize?: boolean;
  /** modify allows accessing the purify instance to e.g. add hooks */
  modify?: (purify: DOMPurifyI) => void;
}

export type Sanitize = (source: Node | string) => HTMLElement;

export default function createSanitize(
  window: Window,
  options?: SanitizeOptions
): Sanitize {
  // Initializing JSDOM and DOMPurify
  const purify = createDOMPurify(window);

  // Setting our DOMPurify config.
  purify.setConfig({
    ...purifyConfig,
    // Always return the DOM to the caller of sanitize.
    RETURN_DOM: true,
    ...options?.config,
  });
  purify.addHook("afterSanitizeAttributes", sanitizeAttributes);
  purify.addHook("afterSanitizeAttributes", sanitizeAnchor);
  if (options?.normalize) {
    purify.addHook("afterSanitizeElements", (n) => {
      if (
        n.nodeType === Node.TEXT_NODE &&
        n.previousSibling?.nodeType === Node.TEXT_NODE
      ) {
        // Merge text node sublings together.
        // eslint-disable-next-line no-unused-expressions
        n.parentNode?.normalize();
      }
    });
  }
  if (options?.modify) {
    options.modify(purify);
  }

  return purify.sanitize.bind(purify);
}
