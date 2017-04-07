import React from 'react';

// Render in place of a Comment when the author of the comment is ignored
const IgnoredCommentTombstone = () => (
  <div>
    <hr aria-hidden={true} />
    <p style={{
      backgroundColor: '#F0F0F0',
      textAlign: 'center',
      padding: '1em',
      color: '#3E4F71',
    }}>
      This comment is hidden because you ignored this user.
    </p>
  </div>
);

export default IgnoredCommentTombstone;
