import React, {PropTypes} from 'react';
import Comment from './Comment';

const Stream = ({
  comments,
  currentUser,
  asset,
  postItem,
  addNotification,
  postAction,
  deleteAction,
  showSignInDialog,
  refetch
}) => {
  return (
    <div>
      {
        comments.map(comment => {
          return <Comment
            refetch={refetch}
            addNotification={addNotification}
            depth={0}
            postItem={postItem}
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
  refetch: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  postItem: PropTypes.func.isRequired,
  asset: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  currentUser: PropTypes.shape({
    displayName: PropTypes.string,
    id: PropTypes.string
  })
};

export default Stream;
