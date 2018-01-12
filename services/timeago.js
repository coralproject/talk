const ta = require('timeago.js');

ta.register('es', require('timeago.js/locales/es'));
ta.register('da', require('timeago.js/locales/da'));
ta.register('fr', require('timeago.js/locales/fr'));
ta.register('pt_BR', require('timeago.js/locales/pt_BR'));

const timeago = ta();

module.exports = time => {
  return timeago.format(new Date(time), 'en');
};
