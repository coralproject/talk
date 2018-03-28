import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminCommentContent.css';
import { AdminCommentContent as Content } from 'plugin-api/beta/client/components';

class AdminCommentContent extends React.Component {
  render() {
    const { comment, suspectWords, bannedWords } = this.props;
    return (
      <Content
        className={styles.content}
        body={comment.richTextBody ? comment.richTextBody : comment.body}
        suspectWords={suspectWords}
        bannedWords={bannedWords}
        html={!!comment.richTextBody}
      />
    );
  }
}

AdminCommentContent.propTypes = {
  comment: PropTypes.object.isRequired,
  suspectWords: PropTypes.array.isRequired,
  bannedWords: PropTypes.array.isRequired,
};

export default AdminCommentContent;
