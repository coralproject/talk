import React from 'react';
import PropTypes from 'prop-types';
import {timeago} from 'coral-framework/services/i18n';
import cn from 'classnames';
import styles from './PubDate.css';

const PubDate = ({className, created_at}) => (
  <div className={cn(className, styles.pubdate, 'talk-comment-pubdate')}>
    {timeago(created_at)}
  </div>
);

PubDate.propTypes = {
  className: PropTypes.string,
  created_at: PropTypes.string,
};

export default PubDate;
