import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './translations';
const lang = new I18n(translations);

export default {
  email: lang.t('error.email'),
  password: lang.t('error.password'),
  displayName: lang.t('error.displayName'),
  confirmPassword: lang.t('error.confirmPassword')
};
