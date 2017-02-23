import React, {PropTypes} from 'react';
import styles from './styles.css';

const FlagBox = props => (
  <div className={styles.flagBox}>
    <h3>Flags:</h3>
    <ul>
      {props.actionSummaries.map((action, i) =>
        <li key={i}>{!action.reason ? <i>No reason provided</i> : action.reason} (<strong>{action.count}</strong>)</li>
      )}
    </ul>
  </div>
);

FlagBox.propTypes = {
  actionSummaries: PropTypes.array.isRequired
};

export default FlagBox;
