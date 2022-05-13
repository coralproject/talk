import createDOMPurify, { DOMPurifyI } from "dompurify";

import { SARCASM_CLASSNAME, SPOILER_CLASSNAME } from "coral-common/constants";

// TODO: Reaching directly into coral-framework for the types. Maybe having
// types in coral-common instead? 🤔
import { GQLRTEConfiguration } from "../../client/framework/schema/__generated__/types";

/** Tags that we remove before looking for suspect/banned words */
export const WORDLIST_FORBID_TAGS = [
  "a",
  "b",
  "strong",
  "i",
  "em",
  "s",
  "del",
  "ins",
  "mark",
  "cite",
  "q",
  "samp",
  "small",
  "sup",
  "sub",
  "span",
  "u",
  "code",
  "time",
  "var",
  "wbr",
  "kbd",
  "abbr",
];

export interface RTEFeatures {
  bold?: boolean;
  italic?: boolean;
  blockquote?: boolean;
  bulletList?: boolean;
  strikethrough?: boolean;
  spoiler?: boolean;
  sarcasm?: boolean;
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
  sarcasm: true,
};

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
    sarcasm: config.enabled && config.sarcasm,
  };
}

const MAILTO_PROTOCOL = "mailto:";

/**
 * Ensure that each anchor tag is replaced with text that
 * corresponds to its inner html. If the tag's href matches
 * its inner html, it remains as is.
 */
const sanitizeAnchor = (node: Element) => {
  if (node.nodeName === "A") {
    let href = node.getAttribute("href");
    let textContent = node.textContent;

    let mailToWithMatchingInnerHtml = false,
      invalidURL = false;
    if (href) {
      let url;
      try {
        url = new URL(href);
      } catch (error) {
        invalidURL = true;
      }

      // Check for a mailto: link with corresponding inner html
      if (url && url.protocol === MAILTO_PROTOCOL) {
        if (href.replace(url.protocol, "") === textContent) {
          mailToWithMatchingInnerHtml = true;
        }
      }

      // Account for whether trailing slashes are included or not
      href = href?.endsWith("/") ? href : (href += "/");
      textContent = textContent?.endsWith("/")
        ? textContent
        : (textContent += "/");
    }
    // When the url is valid and the anchor tag's inner html matches its href
    if (
      !invalidURL &&
      ((href && href === textContent) || mailToWithMatchingInnerHtml)
    ) {
      // Ensure we wrap all the links with the target + rel set
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer ugc");
    } else {
      // Otherwise, turn the anchor link into text corresponding to its inner html
      node.insertAdjacentText("beforebegin", node.innerHTML);
      node.parentNode!.removeChild(node);
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
  if (features.spoiler || features.sarcasm) {
    // Only allow <span class="SPOILER_CLASSNAME"> as our spoiler tag.
    if (node.nodeName === "SPAN") {
      if (features.spoiler && node.classList.contains(SPOILER_CLASSNAME)) {
        // Remove other classes.
        node.className = SPOILER_CLASSNAME;
      } else if (
        features.sarcasm &&
        node.classList.contains(SARCASM_CLASSNAME)
      ) {
        // Remove other classes.
        node.className = SARCASM_CLASSNAME;
      } else {
        node.removeAttribute("class");
      }
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
  if (features.spoiler || features.sarcasm) {
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

// Source for constant: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
// Using this instead of Node.TEXT_NODE because Node is not defined in Node.js
const TEXT_NODE_TYPE = 3;

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
  purify.addHook("afterSanitizeElements", (n) => {
    // Replace nbsp, including those inserted when sanitizing
    // anchor tags and replacing them with their text
    if (n.nodeType === TEXT_NODE_TYPE && n.nodeValue) {
      n.nodeValue = n.nodeValue.replace(/\xA0/g, " ");
    }
  });
  if (options?.normalize) {
    purify.addHook("afterSanitizeElements", (n) => {
      if (
        n.nodeType === TEXT_NODE_TYPE &&
        n.previousSibling?.nodeType === TEXT_NODE_TYPE
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
