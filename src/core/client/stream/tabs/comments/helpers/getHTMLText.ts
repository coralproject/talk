/**
 * getHTMLText returns text representation of html.
 * Includes a different implementation during test that works.
 * @param html
 */
export default function getHTMLText(html: string) {
  if (process.env.NODE_ENV === "test") {
    // innerText is not implement in JSDOM, so we use `striptags` instead.
    const striptags = require("striptags");
    return striptags(html.replace(/<br *\/?>/, "\n"));
  }
  const divElement = document.createElement("div");
  divElement.innerHTML = html;
  return divElement.innerText;
}
