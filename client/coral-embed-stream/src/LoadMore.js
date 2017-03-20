import React, {PropTypes} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
import {ADDTL_COMMENTS_ON_LOAD_MORE} from 'coral-framework/constants/comments';
import {Button} from 'coral-ui';
const lang = new I18n(translations);

const loadMoreComments = (assetId, comments, loadMore, parentId) => {

  let cursor = null;
  if (comments.length) {
    cursor = parentId
      ? comments[0].created_at
      : comments[comments.length - 1].created_at;
  }

  loadMore({
    limit: ADDTL_COMMENTS_ON_LOAD_MORE,
    cursor,
    assetId,
    parent_id: parentId,
    sort: parentId ? 'CHRONOLOGICAL' : 'REVERSE_CHRONOLOGICAL'
  });
};

class LoadMore extends React.Component {

  componentDidMount () {
    this.initialState = true;
  }

  replyCountFormat = (count) => {
    if (count === 1) {
      return lang.t('viewReply');
    }

    if (this.initialState) {
      return lang.t('viewAllRepliesInitial', count);
    } else {
      return lang.t('viewAllReplies', count);
    }
  }

  render () {
    const {assetId, comments, loadMore, moreComments, parentId, replyCount, topLevel} = this.props;
    return moreComments
      ? <Button
        className='coral-load-more'
        onClick={() => {
          this.initialState = false;
          loadMoreComments(assetId, comments, loadMore, parentId);
        }}>
        {topLevel ? lang.t('viewMoreComments') : this.replyCountFormat(replyCount)}
      </Button>
      : null;
  }
}

LoadMore.propTypes = {
  assetId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  moreComments: PropTypes.bool.isRequired,
  topLevel: PropTypes.bool.isRequired,
  replyCount: PropTypes.number,
  loadMore: PropTypes.func.isRequired
};

export default LoadMore;
