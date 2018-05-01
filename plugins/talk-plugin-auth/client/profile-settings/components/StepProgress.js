import React from 'react';
import styles from './StepProgress.css';
import { Icon } from 'plugin-api/beta/client/components/ui';

class StepProgress extends React.Component {
  render() {
    return (
      <div>
        <span className={styles.step}>
          <Icon name="done" />
        </span>
      </div>
    );
  }
}

export default StepProgress;
