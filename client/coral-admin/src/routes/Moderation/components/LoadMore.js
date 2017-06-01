import React, {PropTypes} from 'react';
import {Button} from 'coral-ui';
import styles from './styles.css';

const LoadMore = ({loadMore, showLoadMore}) =>
  <div className={styles.loadMoreContainer}>
    {
      showLoadMore && <Button
        className={styles.loadMore}
        onClick={loadMore}>
        Load More
      </Button>
    }
  </div>;

LoadMore.propTypes = {
  loadMore: PropTypes.func.isRequired,
  showLoadMore: PropTypes.bool.isRequired
};

export default LoadMore;
