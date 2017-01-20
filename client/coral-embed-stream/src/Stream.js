import React, {PropTypes} from 'react';
import Comment from './Comment';

const Stream = ({comments, currentUser, asset}) => {
  console.log('currentUser', currentUser);
  return (
    <div>
      {
        comments.map(comment => {
          return <Comment
            asset={asset}
            currentUser={currentUser}
            key={comment.id}
            comment={comment} />;
        })
      }
    </div>
  );
};

Stream.propTypes = {
  asset: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  currentUser: PropTypes.shape({
    displayName: PropTypes.string,
    id: PropTypes.string
  })
};

export default Stream;
