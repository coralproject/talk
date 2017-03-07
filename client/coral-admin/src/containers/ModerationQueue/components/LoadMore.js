import React from 'react';
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

export default LoadMore;
