import React, {PropTypes} from 'react';
import {I18n} from '../coral-framework';

const name = 'coral-plugin-comment-count';

const CommentCount = ({count}) => {
  return <div className={`${name}-text`}>
    {`${count} ${count === 1 ? lang.t('comment.comment') : lang.t('comment_plural')}`}
  </div>;
};

CommentCount.propTypes = {
  count: PropTypes.number.isRequired
};

export default CommentCount;

const lang = new I18n();
