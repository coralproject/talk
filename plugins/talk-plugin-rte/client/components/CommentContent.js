import React from 'react';
import PropTypes from 'prop-types';
import { name } from '../../package.json';

class CommentContent extends React.Component {
  render() {
    const { comment } = this.props;
    return comment.htmlBody ? (
      <div
        className={`${name}-text`}
        dangerouslySetInnerHTML={{ __html: comment.htmlBody }}
      />
    ) : (
      <div className={`${name}-text`}>{comment.body}</div>
    );
  }
}

CommentContent.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentContent;
