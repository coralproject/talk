import I18n from 'coral-i18n/modules/i18n/i18n';
const lang = new I18n();

export default {
  email: lang.t('error.email'),
  password: lang.t('error.password'),
  username: lang.t('error.username'),
  confirmPassword: lang.t('error.confirmPassword'),
  organizationName: lang.t('error.organizationName'),
};
