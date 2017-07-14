import React from 'react';
import FeaturedComment from './FeaturedComment';

export default ({asset: {featuredComments, ...asset}, setActiveTab}) => (
  <div>
    {featuredComments.nodes.map((comment) => 
      <FeaturedComment 
        key={comment.id}
        comment={comment}
        asset={asset}
        setActiveTab={setActiveTab} />
    )}
  </div>
);
