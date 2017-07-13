import React from 'react';

// TODO: This is just example code, and needs to replaced by an actual implementation.
export default ({asset: {recentComments}}) => (
  <div>
    {recentComments.map((comment) => (
      <div key={comment.id}>
        <div><strong>{comment.user.username}</strong></div>
        <div>
          {comment.body}
        </div>
        <hr />
      </div>
    ))}
  </div>
);
