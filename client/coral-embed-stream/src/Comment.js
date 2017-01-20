// this component will
// render its children
// render a like button
// render a permalink button
// render a reply button
// render a flag button
// translate things?

import React, {PropTypes} from 'react';
import PermalinkButton from 'coral-plugin-permalinks/PermalinkButton';

const Comment = ({comment}) => {
  return (
    <div className="comment" id={`c_${comment.id}`}>
      <hr aria-hidden={true} />
      {comment.body}
      <PermalinkButton articleUrl={'some string'} commentId={comment.id} />
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    depth: PropTypes.number,
    actions: PropTypes.array.isRequired,
    body: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        body: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
      })
    ),
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Comment;
