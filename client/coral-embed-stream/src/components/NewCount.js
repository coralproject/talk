import React, {PropTypes} from 'react';

import t from 'coral-framework/services/i18n';

const onLoadMoreClick = ({loadMore, commentCount, firstCommentDate, assetId, setCommentCountCache}) => (e) => {
  e.preventDefault();
  setCommentCountCache(commentCount);
  loadMore({
    asset_id: assetId,
    limit: 500,
    cursor: firstCommentDate,
    sort: 'CHRONOLOGICAL'
  }, true);
};

const NewCount = (props) => {
  const newComments = props.commentCount - props.commentCountCache;

  return <div className='coral-new-comments coral-load-more'>
    {
      props.commentCountCache && newComments > 0 ?
      <button onClick={onLoadMoreClick(props)}>
        {newComments === 1
          ? t('framework.new_count', newComments, t('framework.comment'))
          : t('framework.new_count', newComments, t('framework.comments'))}
      </button>
      : null
    }
  </div>;
};

NewCount.propTypes = {
  commentCount: PropTypes.number.isRequired,
  commentCountCache: PropTypes.number,
  loadMore: PropTypes.func.isRequired,
  assetId: PropTypes.string.isRequired,
  firstCommentDate: PropTypes.string.isRequired
};

export default NewCount;
