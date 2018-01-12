import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'coral-ui';
import styles from './ViewMore.css';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';

const ViewMore = ({ viewMore, count, className, ...rest }) => (
  <div {...rest} className={cn(className, styles.viewMoreContainer)}>
    {count > 0 && (
      <Button className={styles.viewMore} onClick={viewMore}>
        {count === 1
          ? t('framework.new_count', count, t('framework.comment'))
          : t('framework.new_count', count, t('framework.comments'))}
      </Button>
    )}
  </div>
);

ViewMore.propTypes = {
  viewMore: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default ViewMore;
