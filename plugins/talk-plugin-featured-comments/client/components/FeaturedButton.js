import React from 'react';
import withTags from './withTags';

class FeaturedButton extends React.Component {
  render() {
    const {alreadyTagged, deleteTag, postTag} = this.props;
    return (
      <button onClick={alreadyTagged ? deleteTag : postTag}>
        Feature
      </button>
    );
  }
}

export default withTags('featured')(FeaturedButton); 
 