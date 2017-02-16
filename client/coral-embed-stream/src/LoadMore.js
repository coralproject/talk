import React, {PropTypes} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
import {ADDTL_COMMENTS_ON_LOAD_MORE} from 'coral-framework/constants/comments';
import {Button} from 'coral-ui';
const lang = new I18n(translations);

const loadMoreComments = (assetId, comments, loadMore, parentId) => {

  if (!comments.length) {
    return;
  }

  const cursor = parentId
    ? comments[1].created_at
    : comments[comments.length - 1].created_at;

  loadMore({
    limit: ADDTL_COMMENTS_ON_LOAD_MORE,
    cursor,
    assetId,
    parent_id: parentId,
    sort: parentId ? 'CHRONOLOGICAL' : 'REVERSE_CHRONOLOGICAL'
  });
};

const LoadMore = ({assetId, comments, loadMore, moreComments, parentId}) => (
  moreComments
  ? <Button
      className='coral-load-more'
      onClick={() => loadMoreComments(assetId, comments, loadMore, parentId)}>
      {
        lang.t('loadMore')
      }
    </Button>
  : null
);

LoadMore.propTypes = {
  assetId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  moreComments: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired
};

export default LoadMore;
