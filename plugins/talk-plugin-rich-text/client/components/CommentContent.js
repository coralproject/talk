import React from 'react';
import PropTypes from 'prop-types';
import { PLUGIN_NAME } from '../constants';
import cn from 'classnames';
import styles from './CommentContent.css';
import Linkify from 'react-linkify';

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
      <Linkify properties={{ target: '_blank' }}>
        <div className={className}>{comment.body}</div>
      </Linkify>
    );
  }
}

CommentContent.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentContent;
