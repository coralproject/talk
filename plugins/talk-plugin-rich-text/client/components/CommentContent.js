import React from 'react';
import PropTypes from 'prop-types';
import { PLUGIN_NAME } from '../constants';

class CommentContent extends React.Component {
  render() {
    const { comment } = this.props;
    return comment.richTextBody ? (
      <div
        className={`${PLUGIN_NAME}-text`}
        dangerouslySetInnerHTML={{ __html: comment.richTextBody }}
      />
    ) : (
      <div className={`${PLUGIN_NAME}-text`}>{comment.body}</div>
    );
  }
}

CommentContent.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentContent;
