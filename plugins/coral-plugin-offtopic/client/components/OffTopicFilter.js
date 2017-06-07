import React from 'react';
import styles from './styles.css';

export default class OffTopicFilter extends React.Component {

  tag = 'OFF_TOPIC';
  className = 'offTopicComment';
  cn = {[this.className] : {tags: [this.tag]}};

  handleChange = (e) => {
    if (e.target.checked) {
      this.props.addCommentClassName(this.cn);
      this.props.toggleCheckbox();
    } else {
      const idx = this.props.commentClassNames.findIndex((i) => i[this.className]);
      this.props.removeCommentClassName(idx);
      this.props.toggleCheckbox();
    }
    this.props.closeViewingOptions();
  }

  render() {
    return (
      <div className={styles.viewingOption}>
        <label>
          <input type="checkbox" onChange={this.handleChange} checked={this.props.checked} />
          Hide Off-Topic Comments
        </label>
      </div>
    );
  }
}
