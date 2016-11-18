import React from 'react';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';

const NoResults = () => (
  <div>
    {lang.t('community.no-results')}
  </div>
);

export default NoResults;

const lang = new I18n(translations);
