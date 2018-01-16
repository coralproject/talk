import React from 'react';
import styles from './OffTopicFilter.css';
import { t } from 'plugin-api/beta/client/services';

export default class OffTopicFilter extends React.Component {
  tag = 'OFF_TOPIC';
  className = 'talk-plugin-off-topic-comment';
  cn = { [this.className]: { tags: [this.tag] } };

  handleChange = e => {
    if (e.target.checked) {
      this.props.addCommentClassName(this.cn);
      this.props.toggleCheckbox();
    } else {
      const idx = this.props.commentClassNames.findIndex(
        i => i[this.className]
      );
      this.props.removeCommentClassName(idx);
      this.props.toggleCheckbox();
    }
  };

  render() {
    return (
      <label className={styles.label}>
        <input
          type="checkbox"
          onChange={this.handleChange}
          checked={this.props.checked}
          className={styles.input}
        />
        {t('hide_off_topic')}
      </label>
    );
  }
}
