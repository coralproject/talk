import React, {PropTypes} from 'react';
import {Button} from 'coral-ui';
import styles from './styles.css';

const LoadMore = ({comments, loadMore, sort, tab, assetId, showLoadMore}) =>
  <div className={styles.loadMoreContainer}>
    {
      showLoadMore && <Button
        className={styles.loadMore}
        onClick={() => {
          const lastComment = comments[comments.length - 1];
          const cursor = lastComment ? lastComment.created_at : null;
          return loadMore({
            cursor,
            sort,
            tab,
            asset_id: assetId
          });
        }}>
        Load More
      </Button>
    }
  </div>;

LoadMore.propTypes = {
  comments: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  sort: PropTypes.oneOf(['CHRONOLOGICAL', 'REVERSE_CHRONOLOGICAL']).isRequired,
  tab: PropTypes.oneOf(['rejected', 'premod', 'flagged', 'all', 'accepted']).isRequired,
  assetId: PropTypes.string,
  showLoadMore: PropTypes.bool.isRequired
};

export default LoadMore;
