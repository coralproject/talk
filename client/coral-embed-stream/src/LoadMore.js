import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
import {Button} from 'coral-ui';
const lang = new I18n(translations);

const loadMoreComments = (id, comments, loadMore, parentId) => {

  if (!comments.length) {
    return;
  }

  const cursor = parentId
    ? comments[1].created_at
    : comments[comments.length - 1].created_at;

  loadMore({
    limit: 10,
    cursor,
    asset_id: id,
    parent_id: parentId,
    sort: parentId ? 'CHRONOLOGICAL' : 'REVERSE_CHRONOLOGICAL'
  });
};

const LoadMore = ({id, comments, loadMore, moreComments, parentId}) => moreComments ?
  <Button
    className='coral-load-more'
    onClick={() => loadMoreComments(id, comments, loadMore, parentId)}>
    {
      lang.t('loadMore')
    }
  </Button>
  : null;

export default LoadMore;
