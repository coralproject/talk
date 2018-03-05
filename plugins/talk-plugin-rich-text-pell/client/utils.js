export function htmlNormalizer(htmlInput) {
  const str = htmlInput;
  // We are normalizing the input from contenteditable of each browser, also removing unnecesary html tags
  // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content#Differences_in_markup_generation
  console.log(htmlInput);
  return str
    .replace(/<p>/g, '<br>')
    .replace(/<\/p>/g, '')
    .replace(/<div>/g, '<br>')
    .replace(/<\/div>/g, '');
}
