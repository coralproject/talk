import ta from 'timeago.js';
import has from 'lodash/has';
import get from 'lodash/get';
import merge from 'lodash/merge';

import moment from 'moment';
import 'moment/locale/da';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/pt-br';

import { createStorage } from 'coral-framework/services/storage';

import daTA from 'timeago.js/locales/da';
import esTA from 'timeago.js/locales/es';
import frTA from 'timeago.js/locales/fr';
import pt_BRTA from 'timeago.js/locales/pt_BR';
import zh_CNTA from 'timeago.js/locales/zh_CN';
import zh_TWTA from 'timeago.js/locales/zh_TW';
import nl from 'timeago.js/locales/nl';

import en from '../../../locales/en.yml';
import da from '../../../locales/da.yml';
import es from '../../../locales/es.yml';
import fr from '../../../locales/fr.yml';
import pt_BR from '../../../locales/pt_BR.yml';
import zh_CN from '../../../locales/zh_CN.yml';
import zh_TW from '../../../locales/zh_TW.yml';
import nl_NL from '../../../locales/nl_NL.yml';

const defaultLanguage = process.env.TALK_DEFAULT_LANG;
const translations = {
  ...en,
  ...da,
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
  try {
    if (storage) {
      storage.setItem('locale', locale);
    }
  } catch (err) {
    console.error(err);
  }
}

function getLocale(storage) {
  try {
    return (
      (storage && storage.getItem('locale')) ||
      navigator.language ||
      defaultLanguage
    ).split('-')[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function setupTranslations() {
  // Setup the translation framework with the storage.
  const storage = createStorage();

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

  ta.register('es', esTA);
  ta.register('da', daTA);
  ta.register('fr', frTA);
  ta.register('pt_BR', pt_BRTA);
  ta.register('zh_CN', zh_CNTA);
  ta.register('zh_TW', zh_TWTA);
  ta.register('nl_NL', nl);

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
  const fullKey = `${lang}.${key}`;
  if (has(translations, fullKey)) {
    let translation = get(translations, fullKey);

    // replace any {n} with the arguments passed to this method
    replacements.forEach((str, i) => {
      translation = translation.replace(new RegExp(`\\{${i}\\}`, 'g'), str);
    });
    return translation;
  } else {
    console.warn(`${fullKey} language key not set`);
    return key;
  }
}

export default t;

// Setup the translations globally as soon as this module runs.
setupTranslations();
