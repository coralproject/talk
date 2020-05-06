import cn from "classnames";
import { DOMPurifyI } from "dompurify";
import React, { FunctionComponent } from "react";

import { SPOILER_CLASSNAME } from "coral-common/constants";
import createPurify from "coral-common/helpers/createPurify";

import styles from "./HTMLContent.css";

/** Resused DOMPurify instance */
let purify: DOMPurifyI | null = null;
/** Found spoiler tags during sanitization will be placed here. */
let spoilerTags: Element[] = [];

/**
 * Return a purify instance that will be used to handle HTML content.
 */
function getPurifyInstance() {
  if (purify) {
    return purify;
  }
  purify = createPurify(window);

  // Add a hook that detects spoiler tags and adds to `spoilerTags` array
  purify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "SPAN" && node.className === SPOILER_CLASSNAME) {
      spoilerTags.push(node);
    }
  });
  return purify;
}

/**
 * Makes sure SpoilerTag Handler is registered in `global`.
 */
function registerSpoilerTagHandler() {
  if ("handleCoralSpoilerButton" in global) {
    return;
  }
  // Add global spoiler tag handler `handleCoralSpoilerButton`.
  (global as any).handleCoralSpoilerButton = (
    el: HTMLElement,
    event: MouseEvent | KeyboardEvent
  ) => {
    if (
      "key" in event &&
      event.key !== " " &&
      event.key !== "Enter" &&
      event.key !== "Spacebar"
    ) {
      return;
    }
    // Turn to a dumb span and add the `reveal` css class.
    el.innerHTML = el.firstElementChild!.innerHTML;
    el.removeAttribute("onClick");
    el.removeAttribute("title");
    el.removeAttribute("tabindex");
    el.removeAttribute("role");
    el.classList.add(`${SPOILER_CLASSNAME}-reveal`);
  };
}

function transform(source: string | Node) {
  // Sanitize source.
  const el = getPurifyInstance().sanitize(
    source,
    // TODO: Be aware, this has only affect on the return type. It does not affect the config.
    { RETURN_DOM: true }
  );

  // Make sure spoiler tag handler exists.
  registerSpoilerTagHandler();

  // Attach event handlers to spoiler tags.
  spoilerTags.forEach((node) => {
    node.setAttribute("onmousedown", "javascript: event.preventDefault()");
    node.setAttribute("onclick", "handleCoralSpoilerButton(this, event)");
    node.setAttribute("onkeydown", "handleCoralSpoilerButton(this, event)");
    node.setAttribute("role", "button");
    node.setAttribute("title", "Reveal spoiler");
    node.setAttribute("tabindex", "0");
    node.innerHTML = `<span aria-hidden="true">${node.innerHTML}</span>`;
  });

  // Reset top level spoiler tags array.
  spoilerTags = [];

  // Return results.
  return el.innerHTML;
}

interface HTMLContentProps {
  children: string;
  className?: string;
}

const HTMLContent: FunctionComponent<HTMLContentProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(styles.root, className)}
    dangerouslySetInnerHTML={{ __html: transform(children) }}
  />
);

export default HTMLContent;
