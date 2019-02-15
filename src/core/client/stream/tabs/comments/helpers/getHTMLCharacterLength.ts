import getHTMLText from "./getHTMLText";

/**
 * getHTMLCharacterLength will strip all tags and return remaining
 * character length.
 * @param html the html which length should be determined
 */
export default function getHTMLCharacterLength(html: string | undefined) {
  if (!html) {
    return 0;
  }
  const innerText = getHTMLText(html);
  return innerText.trim().replace(/\n/g, "").length;
}
