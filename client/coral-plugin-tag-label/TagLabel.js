import React from 'react';

import styles from './styles.css';

const TagLabel = ({isStaff}) => <div className={`${styles.staff}`}>
  {(isStaff) ? 'Staff' : ''}
</div>;

export default TagLabel;
