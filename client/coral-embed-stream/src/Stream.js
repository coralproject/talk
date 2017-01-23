import React, {PropTypes} from 'react';
import Comment from './Comment';

const Stream = ({comments, currentUser, asset, postAction, deleteAction, showSignInDialog}) => {
  return (
    <div>
      {
        comments.map(comment => {
          return <Comment
            depth={0}
            asset={asset}
            currentUser={currentUser}
            postAction={postAction}
            deleteAction={deleteAction}
            showSignInDialog={showSignInDialog}
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
