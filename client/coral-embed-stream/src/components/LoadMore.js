import React, {PropTypes} from 'react';
import {Button} from 'coral-ui';
import t from 'coral-framework/services/i18n';

class LoadMore extends React.Component {

  componentDidMount () {
    this.initialState = true;
  }

  replyCountFormat = (count) => {
    if (count === 1) {
      return t('framework.view_reply');
    }

    if (this.initialState) {
      return t('framework.view_all_replies_initial', count);
    } else {
      return t('framework.view_all_replies', count);
    }
  }

  render () {
    const {topLevel, moreComments, loadMore, replyCount} = this.props;
    return moreComments
      ? <div className='coral-load-more'>
        <Button
          onClick={() => {
            this.initialState = false;
            loadMore();
          }}>
          {topLevel ? t('framework.view_more_comments') : this.replyCountFormat(replyCount)}
        </Button>
      </div>
      : null;
  }
}

LoadMore.propTypes = {
  replyCount: PropTypes.number,
  topLevel: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired
};

export default LoadMore;
