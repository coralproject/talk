import React from 'react';

import I18n from 'coral-i18n/modules/i18n/i18n';
const lang = new I18n();

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
      {lang.t('framework.comment_is_ignored')}
    </p>
  </div>
);

export default IgnoredCommentTombstone;
