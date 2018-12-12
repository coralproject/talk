import { negotiateLanguages } from 'fluent-langneg/compat';

import has from 'lodash/has';
import get from 'lodash/get';
import merge from 'lodash/merge';
import first from 'lodash/first';
import isUndefined from 'lodash/isUndefined';

import moment from 'moment';
import 'moment/locale/ar';
import 'moment/locale/da';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/nl';
import 'moment/locale/pt-br';

// timeago
import ta from 'timeago.js';
import arTA from 'timeago.js/locales/ar';
import daTA from 'timeago.js/locales/da';
import deTA from 'timeago.js/locales/de';
import esTA from 'timeago.js/locales/es';
import frTA from 'timeago.js/locales/fr';
import itTA from 'timeago.js/locales/it';
import nlTA from 'timeago.js/locales/nl';
import pt_BRTA from 'timeago.js/locales/pt_BR';
import zh_CNTA from 'timeago.js/locales/zh_CN';
import zh_TWTA from 'timeago.js/locales/zh_TW';

// locales
import ar from '../../../locales/ar.yml';
import en from '../../../locales/en.yml';
import da from '../../../locales/da.yml';
import de from '../../../locales/de.yml';
import es from '../../../locales/es.yml';
import fr from '../../../locales/fr.yml';
import it from '../../../locales/it.yml';
import nl_NL from '../../../locales/nl_NL.yml';
import pt_BR from '../../../locales/pt_BR.yml';
import zh_CN from '../../../locales/zh_CN.yml';
import zh_TW from '../../../locales/zh_TW.yml';

// the list of languages that are whitelisted. If false, all languages that are
// supported by Talk will be enabled.
const whitelistedLanguages =
  process.env.TALK_WHITELISTED_LANGUAGES &&
  process.env.TALK_WHITELISTED_LANGUAGES.split(',').map(l => l.trim());

// The default language. If the whitelisted languages is specified and the
// default language is not in that list, then the first language in the
// whitelisted list will be used as the default.
export const defaultLocale = whitelistedLanguages
  ? !whitelistedLanguages.includes(process.env.TALK_DEFAULT_LANG)
    ? whitelistedLanguages[0]
    : process.env.TALK_DEFAULT_LANG
  : process.env.TALK_DEFAULT_LANG;

export const translations = {
  ...ar,
  ...en,
  ...da,
  ...de,
  ...es,
  ...fr,
  ...it,
  ...nl_NL,
  ...pt_BR,
  ...zh_CN,
  ...zh_TW,
};

export const supportedLocales = Object.keys(translations);

let LOCALE;
let TIMEAGO_INSTANCE;

// detectLanguage will try to get the locale from storage if available,
// otherwise will try to get it from the navigator, otherwise, it will fallback
// to the default language.
const detectLanguage = () => {
  var browserLanguages = navigator.languages;
  //IE11 and MS-EDGE do not provide navigator.languages
  if (!browserLanguages) {
    browserLanguages = [navigator.language];
  }
  return first(
    negotiateLanguages(
      browserLanguages,
      whitelistedLanguages || supportedLocales,
      {
        defaultLocale,
        strategy: 'lookup',
      }
    )
  );
};

export function setupTranslations() {
  // locale
  LOCALE = detectLanguage();

  // moment
  moment.locale(LOCALE);

  // timeago
  ta.register('ar', arTA);
  ta.register('es', esTA);
  ta.register('da', daTA);
  ta.register('de', deTA);
  ta.register('fr', frTA);
  ta.register('it', itTA);
  ta.register('nl_NL', nlTA);
  ta.register('pt_BR', pt_BRTA);
  ta.register('zh_CN', zh_CNTA);
  ta.register('zh_TW', zh_TWTA);
  TIMEAGO_INSTANCE = ta();
}

/**
 * loadTranslations will load the new language pack into the existing ones.
 *
 * @param {Object} newTranslations translation object to merge into the existing
 *                                 languages.
 */
export function loadTranslations(newTranslations) {
  // Merge the new translations into the existing translations.
  merge(translations, newTranslations);

  // Push new languages into the supportedLocales array.
  Object.keys(newTranslations).forEach(language => {
    if (!supportedLocales.includes(language)) {
      supportedLocales.push(language);
    }
  });
}

export function timeago(time) {
  return TIMEAGO_INSTANCE.format(new Date(time), LOCALE);
}

/**
 * Expose the translation function
 *
 * it takes a string with the translation key and returns
 * the translation value or the key itself if not found
 * it works with nested translations (my.page.title)
 *
 * any extra parameters are optional and replace a variable marked by {0}, {1}, etc in the translation.
 */
export function t(key, ...replacements) {
  let translation;
  if (has(translations[LOCALE], key)) {
    translation = get(translations[LOCALE], key);
  } else if (has(translations['en'], key)) {
    translation = get(translations['en'], key);
    console.warn(`${LOCALE}.${key} language key not set`);
  }

  if (!translation) {
    console.warn(`${LOCALE}.${key} and en.${key} language key not set`);
    return key;
  }

  // Handle replacements in the translation string.
  return translation.replace(
    /{(\d+)}/g,
    (match, number) =>
      !isUndefined(replacements[number]) ? replacements[number] : match
  );
}

export default t;

// Setup the translations globally as soon as this module runs.
setupTranslations();
