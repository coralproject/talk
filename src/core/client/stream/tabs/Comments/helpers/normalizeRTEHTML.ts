import getHTMLText from "./getHTMLText";

/**
 * cleanupRTEEmptyHTML will try to figure out if given html only contains
 * dead tags like `<b></b>` or `<br />` or `<i></i><br />` which basically
 * means renders nothing and return a standardized `""` instead.
 *
 * @param html the html to be cleaned up
 */
function cleanupRTEEmptyHTML(html: string) {
  if (html.includes("blockquote")) {
    return html;
  }
  const innerText = getHTMLText(html);
  if (
    (innerText !== "\n" && innerText.includes("\n")) ||
    innerText.trim() !== ""
  ) {
    return html;
  }
  return "";
}

export default function normalizeRTEHTML(html: string) {
  // IE11 uses strong and em instead of b and i.
  html = html.replace("<strong>", "<b>");
  html = html.replace("</strong>", "</b>");
  html = html.replace("<em>", "<i>");
  html = html.replace("</em>", "</i>");
  return cleanupRTEEmptyHTML(html);
}
