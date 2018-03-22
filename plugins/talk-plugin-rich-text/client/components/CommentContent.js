import React from 'react';
import PropTypes from 'prop-types';
import { PLUGIN_NAME } from '../constants';
import cn from 'classnames';
import styles from './CommentContent.css';

class CommentContent extends React.Component {
  render() {
    const { comment } = this.props;
    const className = cn(`${PLUGIN_NAME}-text`, styles.content);
    return comment.richTextBody ? (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: comment.richTextBody }}
      />
    ) : (
      <div className={className}>{comment.body}</div>
    );
  }
}

CommentContent.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentContent;
