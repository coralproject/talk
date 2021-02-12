import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";

/**
 * getHTMLCharacterLength will return current character length.
 *
 * @param html the html which length should be determined
 */
export default function getHTMLCharacterLength(html: string | undefined) {
  if (!html) {
    return 0;
  }
  return getHTMLPlainText(html).length;
}
