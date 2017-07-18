import React from 'react';
import FeaturedComment from './FeaturedComment';

export default ({asset: {featuredComments, ...asset}, viewComment}) => (
  <div>
    {featuredComments.nodes.map((comment) =>
      <FeaturedComment
        key={comment.id}
        comment={comment}
        asset={asset}
        viewComment={viewComment} />
    )}
  </div>
);
