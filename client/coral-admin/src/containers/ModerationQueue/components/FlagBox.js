import React, {PropTypes} from 'react';
import {Icon} from 'coral-ui';
import styles from './FlagBox.css';

const FlagBox = props => (
  <div className={styles.flagBox}>
    <div className={styles.container}>
      <div className={styles.header}>
        <Icon name='flag'/><h3>Flags ({props.actionSummaries.length}):</h3>
        <ul>
          {props.actionSummaries.map((action, i) =>
            <li key={i}>{!action.reason ? <i>No reason provided</i> : action.reason} (<strong>{action.count}</strong>)</li>
          )}
        </ul>
        <span className={styles.moreDetail}></span>
      </div>
    </div>
  </div>
);

FlagBox.propTypes = {
  actionSummaries: PropTypes.array.isRequired
};

export default FlagBox;
