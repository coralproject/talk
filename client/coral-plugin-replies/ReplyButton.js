import React, {PropTypes} from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';

const name = 'coral-plugin-replies';

const ReplyButton = ({banned, onClick}) => {
  return (
    <button
      className={`${name}-reply-button`}
      onClick={onClick}>
      {lang.t('reply')}
      <i className={`${name}-icon material-icons`}
        aria-hidden={true}>{banned ? 'BANNED' : 'reply'}</i>
    </button>
  );
};

ReplyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  banned: PropTypes.bool.isRequired
};

export default ReplyButton;

const lang = new I18n(translations);
