import React from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
import has from 'lodash/has';
import reduce from 'lodash/reduce';
const name = 'coral-plugin-comment-count';

const CommentCount = ({items, id}) => {
  let count = 0;
  if (has(items, `assets.${id}.comments`)) {
    count += items.assets[id].comments.length;
  }

  // lodash reduce works on {}
  count += reduce(items.comments, (accum, comment) => {
    if (comment.children) {
      accum += comment.children.length;
    }
    return accum;
  }, 0);

  return <div className={`${name}-text`}>
    {`${count} ${count === 1 ? lang.t('comment') : lang.t('comment-plural')}`}
  </div>;
};

export default CommentCount;

const lang = new I18n(translations);
