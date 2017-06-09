import React, {PropTypes} from 'react';

import t from 'coral-framework/services/i18n';

import classnames from 'classnames';

const name = 'coral-plugin-replies';

const ReplyButton = ({onClick}) => {
  return (
    <button
      className={classnames(`${name}-reply-button`)}
      onClick={onClick}>
      {t('reply')}
      <i className={`${name}-icon material-icons`}
        aria-hidden={true}>reply</i>
    </button>
  );
};

ReplyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ReplyButton;
