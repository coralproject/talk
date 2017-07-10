import React from 'react';

export default ({asset: {recentComments}}) => (
  <div>
    {recentComments.map((comment) => (
      <p key={comment.id}>
        <div><strong>{comment.user.username}</strong></div>
        <div>
          {comment.body}
        </div>
      </p>
    ))}
  </div>
);
