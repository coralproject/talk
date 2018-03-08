import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';
import styles from './NoComments.css';

const NoComments = ({ assetClosed }) => (
  <div className="talk-stream-no-comments">
    {assetClosed ? (
      <div
        className={cn(styles.message, 'talk-stream-no-comments-closed-message')}
      >
        {t('stream.no_comments_and_closed')}
      </div>
    ) : (
      <div className={cn(styles.message, 'talk-stream-no-comments-message')}>
        {t('stream.no_comments')}
      </div>
    )}
  </div>
);

NoComments.propTypes = {
  assetClosed: PropTypes.bool,
};

export default NoComments;
