import React from 'react';
import PropTypes from 'prop-types';

import t from 'coral-framework/services/i18n';

import cn from 'classnames';
import styles from './ReplyButton.css';

const name = 'talk-plugin-replies';

const ReplyButton = ({ onClick }) => {
  return (
    <button
      className={cn(`${name}-reply-button`, styles.button)}
      onClick={onClick}
    >
      <span className={cn(`${name}-label`, styles.label)}>{t('reply')}</span>
      <i
        className={cn(`${name}-icon`, 'material-icons', styles.icon)}
        aria-hidden={true}
      >
        reply
      </i>
    </button>
  );
};

ReplyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ReplyButton;
