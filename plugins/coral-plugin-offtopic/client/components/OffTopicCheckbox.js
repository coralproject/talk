import React from 'react';
import styles from './styles.css';

class OffTopicCheckbox extends React.Component {
  constructor() {
    super();
    this.label = 'OFF_TOPIC';
  }

  handleChange = (e) => {
    if (e.target.checked) {
      this.props.updateComment(this.addTag)
    } else {
      this.props.updateComment(this.removeTag)
    }
  }

  addTag = (state) => ({
    comment: {
      ...state.comment,
      tags: [...state.comment.tags, this.label]
    }
  })

  removeTag = (state) => {
    const idx = state.comment.tags.indexOf(this.label);
    return {
      comment: {
        ...state.comment,
        tags: [
          ...state.comment.tags.slice(0, idx),
          ...state.comment.tags.slice(idx + 1)
        ]
      }
    }
  }

  render() {
    return (
      <div className={styles.offTopic}>
        <label className={styles.offTopicLabel}>
          <input type="checkbox" onChange={this.handleChange}/>
          Off-Topic
        </label>
      </div>
    )
  }
}

export default OffTopicCheckbox;
