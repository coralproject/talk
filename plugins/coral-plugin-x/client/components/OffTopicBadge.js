import React, {Component} from 'react';
import styles from './style.css';

class OffTopicBadge extends Component {
  render() {
    return (
      <span className={styles.badge}>
        OffTopicCheckbox
      </span>
    );
  }
}

export default OffTopicBadge;

