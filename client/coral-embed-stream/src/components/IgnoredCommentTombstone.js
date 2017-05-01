import React from 'react';

import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from 'coral-framework/translations';
const lang = new I18n(translations);

// Render in place of a Comment when the author of the comment is ignored
const IgnoredCommentTombstone = () => (
  <div>
    <hr aria-hidden={true} />
    <p style={{
      backgroundColor: '#F0F0F0',
      textAlign: 'center',
      padding: '1em',
      color: '#3E4F71',
    }}>
      {lang.t('commentIsIgnored')}
    </p>
  </div>
);

export default IgnoredCommentTombstone;
