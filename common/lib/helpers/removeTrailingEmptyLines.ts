/**
 * removeTrailingEmptyLines removes empty lines from HTMLElement.
 */
export default function removeTrailingEmptyLines(element: HTMLElement) {
  while (element.lastElementChild) {
    let content: string;
    if (process.env.WEBPACK === "true") {
      content = element.lastElementChild?.textContent || "";
    } else {
      // textContent is not fully implemented in JSDOM, so we use `innerHTML` and `striptags` instead.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      content = require("striptags")(element.lastElementChild.innerHTML);
    }
    if (content.trim() === "") {
      element.removeChild(element.lastElementChild);
      continue;
    }
    break;
  }
}
