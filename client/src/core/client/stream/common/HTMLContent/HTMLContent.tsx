import cn from "classnames";
import React, { FunctionComponent } from "react";

import { SPOILER_CLASSNAME } from "coral-common/constants";
import { sanitizeAndFindFormattingTags } from "coral-common/helpers/sanitize";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";

import styles from "./HTMLContent.css";

/**
 * Makes sure SpoilerTag Handler is registered in `global`.
 */
function registerSpoilerTagHandler(window: Window) {
  if ("handleCoralSpoilerButton" in window) {
    return;
  }
  // Add global spoiler tag handler `handleCoralSpoilerButton`.
  (window as any).handleCoralSpoilerButton = (
    el: HTMLElement,
    event: MouseEvent | KeyboardEvent
  ) => {
    // in case text is a link
    event.preventDefault();
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

export function transform(window: Window, source: string | Node) {
  // Sanitize source.
  const [sanitized, spoilerTags] = sanitizeAndFindFormattingTags(
    window,
    source
  );

  // Make sure spoiler tag handler exists.
  registerSpoilerTagHandler(window);

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
  // Return results.
  return sanitized.innerHTML;
}

interface HTMLContentProps {
  children: string;
  className?: string;
}

const HTMLContent: FunctionComponent<HTMLContentProps> = ({
  children,
  className,
}) => {
  const { window } = useCoralContext();
  return (
    <div
      className={cn(styles.root, className)}
      dangerouslySetInnerHTML={{ __html: transform(window, children) }}
    />
  );
};

export default HTMLContent;
