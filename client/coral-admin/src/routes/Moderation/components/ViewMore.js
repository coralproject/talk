import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'coral-ui';
import styles from './ViewMore.css';
import cn from 'classnames';

const ViewMore = ({viewMore, count, className, ...rest}) =>
  <div {...rest} className={cn(className, styles.viewMoreContainer)}>
    {
      count > 0 && <Button
        className={styles.viewMore}
        onClick={viewMore}>
        View {count} New {count > 1 ? 'Comments' : 'Comment'}
      </Button>
    }
  </div>;

ViewMore.propTypes = {
  viewMore: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default ViewMore;
