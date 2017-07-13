import React from 'react';
import FeaturedComment from './FeaturedComment';

export default ({asset: {featuredComments}, setActiveTab}) => (
  <div>
    {featuredComments.nodes.map((comment) => 
      <FeaturedComment 
        key={comment.id}
        comment={comment}
        setActiveTab={setActiveTab} />
    )}
  </div>
);
