export function htmlNormalizer(htmlInput) {
  let str = htmlInput;
  // We are normalizing the input from contenteditable of each browser, also removing unnecesary html tags
  // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content#Differences_in_markup_generation

  // Old browsers uses `p` normalize to `div` instead.
  str = str
    .replace(/<p>/g, '<div>') // IE and old browsers outputs <p> instead of <div>s
    .replace(/<\/p>/g, '</div>'); // IE and old browsers outputs <p> instead of <div>s

  // Remove first opening tag, otherwise
  // with the following transformation below
  // we might add an unintended first empty line.
  if (str.startsWith('<div>')) {
    str = str.replace('<div>', '');
  }

  // Normalize <div>s to <br>.
  return str.replace(/<div>/g, '<br>').replace(/<\/div>/g, '');
}
