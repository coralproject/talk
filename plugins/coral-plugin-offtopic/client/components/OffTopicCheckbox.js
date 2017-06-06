import React from 'react';
import styles from './styles.css';

import t from 'coral-framework/services/i18n';

export default class OffTopicCheckbox extends React.Component {

  label = 'OFF_TOPIC';

  handleChange = (e) => {
    if (e.target.checked) {
      this.props.addTag(this.label);
    } else {
      const idx = this.props.commentBox.tags.indexOf(this.label);
      this.props.removeTag(idx);
    }
  }

  render() {
    return (
      <div className={styles.offTopic}>
        {
          !this.props.isReply ? (
            <label className={styles.offTopicLabel}>
              <input type="checkbox" onChange={this.handleChange}/>
              {t('off_topic')}
            </label>
          ) : null
        }
      </div>
    );
  }
}
