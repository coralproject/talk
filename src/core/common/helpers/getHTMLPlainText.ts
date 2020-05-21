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
    // textContent is not fully implemented in JSDOM, so we use `striptags` inste ad.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    textContent = require("striptags")(htmlWithNewLine);
  } else {
    const divElement = document.createElement("div");
    divElement.innerHTML = htmlWithNewLine;
    textContent = divElement.textContent || "";
  }
  return textContent.trimRight();
}
