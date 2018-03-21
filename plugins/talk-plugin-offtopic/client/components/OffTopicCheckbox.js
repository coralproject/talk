import React from 'react';
import PropTypes from 'prop-types';
import styles from './OffTopicCheckbox.css';

import { t } from 'plugin-api/beta/client/services';

export default class OffTopicCheckbox extends React.Component {
  render() {
    return (
      <div className={styles.offTopic}>
        <label className={styles.offTopicLabel}>
          <input
            type="checkbox"
            onChange={this.props.onChange}
            checked={this.props.checked}
          />
          {t('off_topic')}
        </label>
      </div>
    );
  }
}

OffTopicCheckbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};
