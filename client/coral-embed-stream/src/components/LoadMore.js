import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'coral-ui';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';

class LoadMore extends React.Component {
  replyCountFormat = (count) => {
    if (!count) {
      return t('framework.show_all_replies');
    }
    if (count === 1) {
      return t('framework.show_1_more_reply');
    }

    return t('framework.show_x_more_replies', count);
  }

  render () {
    const {topLevel, moreComments, replyCount, loadingState, loadMore} = this.props;
    const disabled = loadingState === 'loading';
    return moreComments
      ? <div className='talk-load-more'>
        <Button
          onClick={loadMore}
          className={cn('talk-load-more-button', {[`talk-load-more-button-${loadingState}`]: loadingState})}
          disabled={disabled}
        >
          {topLevel ? t('framework.view_more_comments') : this.replyCountFormat(replyCount)}
        </Button>
      </div>
      : null;
  }
}

LoadMore.propTypes = {
  replyCount: PropTypes.number,
  topLevel: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  moreComments: PropTypes.bool,
  loadingState: PropTypes.oneOf(['', 'loading', 'success', 'error']),
};

export default LoadMore;
