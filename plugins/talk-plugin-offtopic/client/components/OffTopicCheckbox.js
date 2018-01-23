import React from 'react';
import styles from './OffTopicCheckbox.css';

import { t } from 'plugin-api/beta/client/services';

export default class OffTopicCheckbox extends React.Component {
  label = 'OFF_TOPIC';

  componentDidMount() {
    this.clearTagsHook = this.props.registerHook('postSubmit', () => {
      const idx = this.props.tags.indexOf(this.label);
      this.props.removeTag(idx);
    });
  }

  componentWillUnmount() {
    this.props.unregisterHook(this.clearTagsHook);
  }

  handleChange = e => {
    const { addTag, removeTag } = this.props;
    if (e.target.checked) {
      addTag(this.label);
    } else {
      const idx = this.props.tags.indexOf(this.label);
      removeTag(idx);
    }
  };

  render() {
    const checked = this.props.tags.indexOf(this.label) >= 0;
    return (
      <div className={styles.offTopic}>
        {!this.props.isReply ? (
          <label className={styles.offTopicLabel}>
            <input
              type="checkbox"
              onChange={this.handleChange}
              checked={checked}
            />
            {t('off_topic')}
          </label>
        ) : null}
      </div>
    );
  }
}
