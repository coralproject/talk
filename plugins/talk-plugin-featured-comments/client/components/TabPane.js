import React from 'react';
import Comment from '../containers/Comment';

export default ({root, data, asset: {featuredComments, ...asset}, viewComment}) => (
  <div>
    {featuredComments.nodes.map((comment) =>
      <Comment
        key={comment.id}
        root={root}
        data={data}
        comment={comment}
        asset={asset}
        viewComment={viewComment} />
    )}
  </div>
);
