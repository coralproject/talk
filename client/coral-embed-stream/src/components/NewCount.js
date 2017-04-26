import React, {PropTypes} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);

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
          ? lang.t('newCount', newComments, lang.t('comment'))
          : lang.t('newCount', newComments, lang.t('comments'))}
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
