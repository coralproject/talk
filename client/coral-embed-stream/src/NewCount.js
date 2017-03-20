import React, { PropTypes } from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);

const onLoadMoreClick = ({ loadMore, commentCount, firstCommentDate, assetId, updateCountCache }) => (e) => {
  e.preventDefault();
  updateCountCache(assetId, commentCount);
  loadMore({
    limit: 500,
    cursor: firstCommentDate,
    assetId,
    sort: 'CHRONOLOGICAL'
  }, true);
};

const NewCount = (props) => {
  const newComments = props.commentCount - props.countCache;

  return <div className='coral-new-comments'>
    {
      props.countCache && newComments > 0 ?
      <button onClick={onLoadMoreClick(props)} className='coral-load-more'>
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
  countCache: PropTypes.number,
  loadMore: PropTypes.func.isRequired,
  assetId: PropTypes.string.isRequired,
  firstCommentDate: PropTypes.string.isRequired
};

export default NewCount;
