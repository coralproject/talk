import React, {PropTypes} from 'react';
import Comment from './Comment';

const Stream = ({comments}) => {
  return (
    <div>
      {
        comments.map(comment => {
          return <Comment key={comment.id} comment={comment} />;
        })
      }
    </div>
  );
};

Stream.propTypes = {
  comments: PropTypes.array.isRequired
};

export default Stream;
