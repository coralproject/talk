import React from 'react';

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
