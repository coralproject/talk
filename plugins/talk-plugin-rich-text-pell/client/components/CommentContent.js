import React from 'react';
import PropTypes from 'prop-types';
import { pluginName } from '../../package.json';

class CommentContent extends React.Component {
  render() {
    const { comment } = this.props;
    return comment.richTextBody ? (
      <div
        className={`${pluginName}-text`}
        dangerouslySetInnerHTML={{ __html: comment.richTextBody }}
      />
    ) : (
      <div className={`${pluginName}-text`}>{comment.body}</div>
    );
  }
}

CommentContent.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentContent;
