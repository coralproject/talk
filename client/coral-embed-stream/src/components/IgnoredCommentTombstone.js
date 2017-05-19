import React from 'react';

import t from 'coral-framework/services/i18n';

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
      {t('framework.comment_is_ignored')}
    </p>
  </div>
);

export default IgnoredCommentTombstone;
