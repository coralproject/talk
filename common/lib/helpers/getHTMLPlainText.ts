import { decode } from "he";

/**
 * getHTMLPlainText returns text representation of html.
 *
 * @param html string
 */
export default function getHTMLPlainText(html: string): string {
  const htmlWithNewLine = html.replace(
    /((<\/(ul|li|blockquote)>)|(<\/(div|p)>\s*(<[^/]))|(<br>(?!\s*<\/(div|p|li|blockquote))))/g,
    "\n$1"
  );

  let textContent: string;

  if (process.env.WEBPACK !== "true") {
    // textContent is not fully implemented in JSDOM, so we use `striptags`
    // instead, and `he.decode` to decode HTML Entities.

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    textContent = decode(require("striptags")(htmlWithNewLine));
  } else {
    // eslint-disable-next-line no-restricted-globals
    const divElement = window.document.createElement("div");
    divElement.innerHTML = htmlWithNewLine;
    textContent = divElement.textContent || "";
  }

  // Trim the text content.
  return textContent.trim();
}
