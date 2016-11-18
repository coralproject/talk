import React from 'react';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';

const Loading = () => (
  <h1> {lang.t('community.loading')} </h1>
);

export default Loading;

const lang = new I18n(translations);
