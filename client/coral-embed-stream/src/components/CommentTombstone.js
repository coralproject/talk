import React from 'react';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import styles from './CommentTombstone.css';

// Render in place of a Comment when the author of the comment is <action>
class CommentTombstone extends React.Component {
  getCopy() {
    const {action} = this.props;

    switch (action) {
    case 'ignore':
      return t('framework.comment_is_ignored');
    case 'reject':
      return t('framework.comment_is_rejected');
    default :
      return t('framework.comment_is_hidden');
    }
  }

  render() {
    return (
      <div className="talk-comment-tombstone">
        <hr aria-hidden={true} />
        <p className={styles.commentTombstone}>
          {this.getCopy()}
        </p>
      </div>
    );
  }
}

CommentTombstone.propTypes = {
  action: PropTypes.string,
};

export default CommentTombstone;
