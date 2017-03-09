import React, {PropTypes} from 'react';
import {Button} from 'coral-ui';
import styles from './styles.css';

const LoadMore = ({comments, loadMore, sort, tab, assetId, showLoadMore}) =>
  <div className={styles.loadMoreContainer}>
    {
      showLoadMore && <Button
        className={styles.loadMore}
        onClick={() =>
          loadMore({
            cursor: comments[comments.length - 1].created_at,
            sort,
            tab,
            asset_id: assetId
          })}>
        Load More
      </Button>
    }
  </div>;

LoadMore.propTypes = {
  comments: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  sort: PropTypes.oneOf(['CHRONOLOGICAL', 'REVERSE_CHRONOLOGICAL']).isRequired,
  tab: PropTypes.oneOf(['rejected', 'premod', 'flagged']).isRequired,
  assetId: PropTypes.string,
  showLoadMore: PropTypes.bool.isRequired
};

export default LoadMore;
