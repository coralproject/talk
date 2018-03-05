export function htmlNormalizer(htmlInput) {
  const str = htmlInput;
  // We are normalizing the input from contenteditable of each browser, also removing unnecesary html tags
  // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content#Differences_in_markup_generation
  return str
    .replace('<p>', '<div>') // IE outputs <p> instead of <div>s
    .replace('</p>', '</div>') // IE outputs <p> instead of <div>s
    .replace('<div>', '<br>')
    .replace('</div>', '');
}
