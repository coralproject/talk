export default function trimHTML(html: string) {
  const divElement = document.createElement("div");
  divElement.innerHTML = html;
  while (divElement.lastElementChild) {
    let content = divElement.lastElementChild?.textContent || "";
    if (process.env.WEBPACK !== "true") {
      // textContent is not fully implemented in JSDOM, so we use `innerHTML` and `striptags` instead.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      content = require("striptags")(divElement.lastElementChild.innerHTML);
    }
    if (content.trim() === "") {
      divElement.removeChild(divElement.lastElementChild);
      continue;
    }
    break;
  }
  return divElement.innerHTML;
}
