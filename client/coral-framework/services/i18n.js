import ta from 'timeago.js';
import has from 'lodash/has';
import get from 'lodash/get';
import merge from 'lodash/merge';

import moment from 'moment';
import 'moment/locale/ar';
import 'moment/locale/da';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/nl';
import 'moment/locale/pt-br';

import { createStorage } from 'coral-framework/services/storage';

import arTA from 'timeago.js/locales/ar';
import daTA from 'timeago.js/locales/da';
import deTA from 'timeago.js/locales/de';
import esTA from 'timeago.js/locales/es';
import frTA from 'timeago.js/locales/fr';
import nlTA from 'timeago.js/locales/nl';
import pt_BRTA from 'timeago.js/locales/pt_BR';
import zh_CNTA from 'timeago.js/locales/zh_CN';
import zh_TWTA from 'timeago.js/locales/zh_TW';

import ar from '../../../locales/ar.yml';
import en from '../../../locales/en.yml';
import da from '../../../locales/da.yml';
import de from '../../../locales/de.yml';
import es from '../../../locales/es.yml';
import fr from '../../../locales/fr.yml';
import nl_NL from '../../../locales/nl_NL.yml';
import pt_BR from '../../../locales/pt_BR.yml';
import zh_CN from '../../../locales/zh_CN.yml';
import zh_TW from '../../../locales/zh_TW.yml';

const defaultLanguage = process.env.TALK_DEFAULT_LANG;
const translations = {
  ...ar,
  ...en,
  ...da,
  ...de,
  ...es,
  ...fr,
  ...nl_NL,
  ...pt_BR,
  ...zh_CN,
  ...zh_TW,
};

let lang;
let timeagoInstance;

function setLocale(storage, locale) {
  storage.setItem('locale', locale);
}

/*
  Map browser language codes to right locale codes in TALK

  As listed in http://4umi.com/web/html/languagecodes.php, browser language code for CN
  is in different format with CN locales in TALK.
  Do the mapping to get right CN locales for TALK to use.
*/
function mappingLocaleCode(lang) {
  switch (lang) {
    case 'zh-TW':
    case 'zh-HK':
      return 'zh_TW';
    case 'zh-CN':
      return 'zh_CN';
    default:
      return lang;
  }
}

// detectLanguage will try to get the locale from storage if available,
// otherwise will try to get it from the navigator, otherwise, it will fallback
// to the default language.
function detectLanguage(storage) {
  try {
    const lang = storage.getItem('locale') || navigator.language;
    if (lang) {
      return lang;
    }
  } catch (err) {
    console.warn(
      'Error while trying to detect language, will fallback to',
      err
    );
  }

  console.warn('Could not detect language, will fallback to', defaultLanguage);
  return defaultLanguage;
}

// getLocale will get the users locale from the local detector and parse it to a
// format we can work with.
function getLocale(storage) {
  // Get the language from the local detector.
  const lang = detectLanguage(storage);

  // Some language strings come with additional subtags as defined in:
  //
  // https://www.ietf.org/rfc/bcp/bcp47.txt
  //
  // So we should strip that off if we find it.
  return lang.split('-')[0];
}

export function setupTranslations() {
  // Setup the translation framework with the storage.
  const storage = createStorage('localStorage');

  const locale = getLocale(storage);
  setLocale(storage, locale);

  // Setting moment
  moment.locale(locale);

  // Extract language key.
  lang = locale.split('-')[0];

  // Check if we have a translation in this language.
  if (!(lang in translations)) {
    lang = defaultLanguage;
  }

  ta.register('ar', arTA);
  ta.register('es', esTA);
  ta.register('da', daTA);
  ta.register('de', deTA);
  ta.register('fr', frTA);
  ta.register('nl_NL', nlTA);
  ta.register('pt_BR', pt_BRTA);
  ta.register('zh_CN', zh_CNTA);
  ta.register('zh_TW', zh_TWTA);

  timeagoInstance = ta();
}

export function loadTranslations(newTranslations) {
  merge(translations, newTranslations);
}

export function timeago(time) {
  return timeagoInstance.format(new Date(time), lang);
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
  if (has(translations[lang], key)) {
    translation = get(translations[lang], key);
  } else if (has(translations['en'], key)) {
    translation = get(translations['en'], key);
    console.warn(`${lang}.${key} language key not set`);
  }

  if (translation) {
    // replace any {n} with the arguments passed to this method
    replacements.forEach((str, i) => {
      translation = translation.replace(new RegExp(`\\{${i}\\}`, 'g'), str);
    });

    return translation;
  } else {
    console.warn(`${lang}.${key} and en.${key} language key not set`);
    return key;
  }
}

export default t;

// Setup the translations globally as soon as this module runs.
setupTranslations();
