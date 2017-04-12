import React, {PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
const name = 'coral-plugin-comment-count';

const CommentCount = ({count, handleClick}) => {
  return <div className={`${name}-text`} onClick={handleClick}>
    {`${count} ${count === 1 ? lang.t('comment') : lang.t('comment-plural')}`}
  </div>;
};

CommentCount.propTypes = {
  count: PropTypes.number.isRequired
};

export default CommentCount;

const lang = new I18n(translations);
