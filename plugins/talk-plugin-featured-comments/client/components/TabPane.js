import React from 'react';
import FeaturedComment from './FeaturedComment';

export default ({root, data, asset: {featuredComments, ...asset}, viewComment}) => (
  <div>
    {featuredComments.nodes.map((comment) =>
      <FeaturedComment
        key={comment.id}
        root={root}
        data={data}
        comment={comment}
        asset={asset}
        viewComment={viewComment} />
    )}
  </div>
);
