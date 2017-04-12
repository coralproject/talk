import React from 'react';
import styles from './styles.css';
import {addCommentTag} from 'coral-framework/graphql/mutations';
import {compose} from 'react-apollo';

class OffTopicCheckbox extends React.Component {

  handleChange = (e) => {
    if (e.target.checked) {
      this.addCommentTagHook = this.props.registerHook('postSubmit', (data) => {
        const {comment} = data.createComment;
        this.props.addCommentTag({
          id: comment.id,
          tag: 'OFF_TOPIC'
        });
      })
    } else {
      this.props.unregisterHook(this.addCommentTagHook);
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

export default compose(addCommentTag)(OffTopicCheckbox);
