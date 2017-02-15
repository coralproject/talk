import React, {PropTypes} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
import {Button} from 'coral-ui';
const lang = new I18n(translations);

const loadMoreComments = (assetId, comments, loadMore) => {

  if (!comments.length) {
    return;
  }

  loadMore({
    limit: 10,
    cursor: comments[comments.length - 1].created_at,
    assetId,
    sort: 'REVERSE_CHRONOLOGICAL'
  });
};

const LoadMore = ({assetId, comments, loadMore, moreComments}) => (
  moreComments
  ? <Button
      className='coral-load-more'
      onClick={() => loadMoreComments(assetId, comments, loadMore)}>
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
