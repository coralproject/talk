/* global hexo */
const cheerio = require('cheerio');

// This helper replaces the ol tags outputted by the base toc helper with ui
// tags.
hexo.extend.helper.register('oltoul', function(source) {
  const $ = cheerio.load(source);

  // Sourced from https://stackoverflow.com/a/12679823
  $(
    $('ol')
      .get()
      .reverse()
  ).each(function() {
    $(this).replaceWith($('<ul>' + $(this).html() + '</ul>'));
  });

  return $.html();
});
