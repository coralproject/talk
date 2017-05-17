import React, {PropTypes} from 'react';

import t from 'coral-i18n/services/i18n';

import classnames from 'classnames';

const name = 'coral-plugin-replies';

const ReplyButton = ({banned, onClick}) => {
  return (
    <button
      className={classnames(`${name}-reply-button`)}
      onClick={onClick}>
      {t('reply')}
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
