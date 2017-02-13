import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
import Button from 'coral-ui';
const lang = new I18n(translations);

const loadMoreComments = (id, comments, loadMore) => {

  if (!comments.length) {
    return;
  }

  loadMore({
    limit: 10,
    cursor: comments[comments.length - 1].created_at,
    asset_id: id,
    sort: 'REVERSE_CHRONOLOGICAL'
  });
};

const LoadMore = ({id, comments, loadMore}) => comments.length > 5 ?
  <Button
    className='coral-load-more'
    onClick={() => loadMoreComments(id, comments, loadMore)}>
    {
      lang.t('loadMore')
    }
  </Button>
  : null;

export default LoadMore;
