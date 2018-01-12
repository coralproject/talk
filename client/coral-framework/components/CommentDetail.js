import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './CommentDetail.css';
import { Icon } from 'coral-ui';

const CommentDetail = ({ icon, header, info, children, className }) => {
  return (
    <div className={cn(className, styles.root)}>
      <div className={styles.headerContainer}>
        {icon && <Icon className={styles.icon} name={icon} />}
        <h3 className={styles.header}>{header}:</h3>
        <div className={styles.info}>{info}</div>
      </div>
      {children && <div className={styles.details}>{children}</div>}
    </div>
  );
};

CommentDetail.propTypes = {
  className: PropTypes.string,
  header: PropTypes.node,
  icon: PropTypes.string,
  info: PropTypes.node,
  children: PropTypes.node,
};

export default CommentDetail;
