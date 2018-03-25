export function htmlNormalizer(htmlInput) {
  let str = htmlInput;
  // Some tags have not been normalized across browsers in `Coral RTE` yet.
  // So we'll do this manual step here for now.

  // Harmonize all to <b> tag.
  str = str
    .replace(/<strong>/g, '<b>') // IE
    .replace(/<\/strong>/g, '</b>'); // IE

  // Harmonize all to <i> tag.
  str = str
    .replace(/<em>/g, '<i>') // IE
    .replace(/<\/em>/g, '</i>'); // IE
  return str;
}
