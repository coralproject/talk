import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'coral-ui';
import styles from './LoadMore.css';
import cn from 'classnames';

const LoadMore = ({ loadMore, showLoadMore, className = '', ...rest }) => (
  <div {...rest} className={cn(className, styles.loadMoreContainer)}>
    {showLoadMore && (
      <Button className={styles.loadMore} onClick={loadMore}>
        Load More
      </Button>
    )}
  </div>
);

LoadMore.propTypes = {
  className: PropTypes.string,
  loadMore: PropTypes.func.isRequired,
  showLoadMore: PropTypes.bool.isRequired,
};

export default LoadMore;
