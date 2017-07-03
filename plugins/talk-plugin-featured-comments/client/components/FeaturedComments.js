import React from 'react';
import styles from './styles.css';
import FeaturedComment from './FeaturedComment';

const isFeatured = (tags) => !!tags.filter((t) => t.tag.name === 'FEATURED').length;

class FeaturedComments extends React.Component {
  render() {

    const {view : comments}  = this.props;

    const featuredComments = comments.reduce((acc, curr) => {
      if (isFeatured(curr.tags)) {
        acc.push(curr);
      }

      return acc;
    }, []);

    return (
      <div className={styles.featuredComments}>
        {
          featuredComments.map((comment, i) => 
            <FeaturedComment 
              comment={comment}
              key={i}
            />
          )
        }
      </div>
    );
  }
}

export default FeaturedComments;
