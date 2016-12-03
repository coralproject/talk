import timeago from 'timeago.js';
import esTA from '../../../../node_modules/timeago.js/locales/es';

/**
 * Default locales, this should be overriden by config file
 */

class i18n {
  constructor (translations) {
    /**
     * Register locales
     */

    this.locales = {'en': 'en', 'es': 'es'};
    timeago.register('es_ES', esTA);
    this.timeagoInstance = new timeago();
    /**
     * Load translations
     */
    let trans = translations || {en: {}};

    try {
      const locale = localStorage.getItem('locale') || navigator.language;
      localStorage.setItem('locale', locale);
      const lang = this.locales[locale.split('-')[0]] || 'en';
      this.translations = trans[lang];
    } catch (err) {
      this.translations = trans['en'];
    }

    this.setLocale = (locale) => {
      try {
        localStorage.setItem('locale', locale);
      } catch (err) {
        console.error(err);
      }
    };

    this.getLocale = () => (
      localStorage.getItem('locale') || navigator.locale || 'en-US'
    );

      /**
       * Expose the translation function
       *
       * it takes a string with the translation key and returns
       * the translation value or the key itself if not found
       * it works with nested translations (my.page.title)
       *
       * the second parameter is optional and replaces a variable marked by {0} in the translation.
       */

    this.t = (key, att) => {
      const arr = key.split('.');
      let translation = this.translations;
      try {
        for (let i = 0; i < arr.length; i++) {translation = translation[arr[i]];}
      } catch (error) {
        console.warn(`${key} language key not set`);
        return key;
      }

      let val = String(translation);
      if (val) {
        val = val.replace('/\{0\/g', att);
        return val;
      } else {
        console.warn(`${key} language key not set`);
        return key;
      }
    };

    this.timeago = (time) => {
      return this.timeagoInstance.format(time);
    };
  }
}

export default i18n;
