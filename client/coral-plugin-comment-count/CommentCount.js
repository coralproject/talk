import React, {PropTypes} from 'react';

import t from 'coral-framework/services/i18n';

const name = 'coral-plugin-comment-count';

const CommentCount = ({count}) => {
  return <div className={`${name}-text`}>
    {`${count} ${count === 1 ? t('comment_singular') : t('comment_plural')}`}
  </div>;
};

CommentCount.propTypes = {
  count: PropTypes.number.isRequired
};

export default CommentCount;
