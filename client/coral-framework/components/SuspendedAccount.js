import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);

export default () => (
  <span>{lang.t('suspendedAccountMsg')}</span>
);
