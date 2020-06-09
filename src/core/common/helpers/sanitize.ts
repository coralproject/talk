import createDOMPurify, { DOMPurifyI } from "dompurify";

import { SPOILER_CLASSNAME } from "coral-common/constants";

// TODO: Reaching directly into coral-framework for the types. Maybe having
// types in coral-common instead? 🤔
import { GQLRTEConfiguration } from "../../client/framework/schema/__generated__/types";

export interface RTEFeatures {
  bold?: boolean;
  italic?: boolean;
  blockquote?: boolean;
  bulletList?: boolean;
  strikethrough?: boolean;
  spoiler?: boolean;
}

/**
 * ALL_FEATURES is a predefined map of RTEFeatures with all
 * features turned on
 */
export const ALL_FEATURES: RTEFeatures = {
  bold: true,
  italic: true,
  blockquote: true,
  bulletList: true,
  strikethrough: true,
  spoiler: true,
};

const MAILTO_PROTOCOL = "mailto:";

/**
 * convertGQLRTEConfigToRTEFeatures turns the
 * RTE configuration from the GraphQL Schema to
 * RTEFeatures.
 */
export function convertGQLRTEConfigToRTEFeatures(
  config: Partial<GQLRTEConfiguration>
): RTEFeatures {
  return {
    bold: config.enabled,
    italic: config.enabled,
    blockquote: config.enabled,
    bulletList: config.enabled,
    strikethrough: config.enabled && config.strikethrough,
    spoiler: config.enabled && config.spoiler,
  };
}

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
const sanitizeAttributes = (features: RTEFeatures, node: Element) => {
  // Only achor tags can have the `href` attribute.
  if (node.nodeName !== "A" && node.getAttribute("href")) {
    node.removeAttribute("href");
  }
  if (features.spoiler) {
    // Only allow <span class="SPOILER_CLASSNAME"> as our spoiler tag.
    if (
      node.nodeName === "SPAN" &&
      node.classList.contains(SPOILER_CLASSNAME)
    ) {
      // Remove other classes.
      node.className = SPOILER_CLASSNAME;
    } else {
      node.removeAttribute("class");
    }
  }
};

function createPurifyConfig(features: RTEFeatures) {
  const ALLOWED_TAGS = ["a", "br", "div", "p"];
  const ALLOWED_ATTR = [
    // Allow href tags for anchor tags.
    "href",
  ];

  if (features.bold) {
    ALLOWED_TAGS.push("b", "strong");
  }
  if (features.italic) {
    ALLOWED_TAGS.push("i", "em");
  }
  if (features.blockquote) {
    ALLOWED_TAGS.push("blockquote");
  }
  if (features.bulletList) {
    ALLOWED_TAGS.push("ul", "li");
  }
  if (features.strikethrough) {
    ALLOWED_TAGS.push("s");
  }
  if (features.spoiler) {
    ALLOWED_TAGS.push("span");
    ALLOWED_ATTR.push("class");
  }

  return {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // `ALLOW_ARIA_ATTR` not typed as for v2.0.1.
    ALLOW_ARIA_ATTR: false,
  };
}

export interface SanitizeOptions {
  /** Allow overriding parts of the config */
  config?: any;
  /** normalize makes sure that neighboring text nodes are merged */
  normalize?: boolean;
  /** modify allows accessing the purify instance to e.g. add hooks */
  modify?: (purify: DOMPurifyI) => void;
  /** enable individual features. If not set, all are disabled */
  features?: RTEFeatures;
}

export type Sanitize = (source: Node | string) => HTMLElement;

export function createSanitize(
  window: Window,
  options?: SanitizeOptions
): Sanitize {
  // Initializing JSDOM and DOMPurify
  const purify = createDOMPurify(window);
  const features = options?.features || {};

  // Setting our DOMPurify config.
  purify.setConfig({
    ...createPurifyConfig(features),
    // Always return the DOM to the caller of sanitize.
    RETURN_DOM: true,
    ...options?.config,
  });
  purify.addHook(
    "afterSanitizeAttributes",
    sanitizeAttributes.bind(null, features)
  );
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
