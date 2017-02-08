import React from 'react';

// import Comment from '../../components/Comment';

export default (props) => {
  return (
    <div>
      {/* <Comment*/}
      {/* comment={comment}*/}
      {/* key={i}*/}
      {/* author={comment.user}*/}
      {/* />*/}
      {
        props.data[props.activeTab].map((comment, i) =>
          <div key={i}>
            {comment.body}
          </div>
        )
      }
    </div>
  );
};
