import React from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
const name = 'coral-plugin-comment-count';

const CommentCount = ({items, id}) => {
  let count = 0;
  if (items.assets[id] && items.assets[id].comments) {
    count += items.assets[id].comments.length;
  }
  const itemKeys = Object.keys(items.comments);
  for (let i = 0; i < itemKeys.length; i++) {
    const item = items.comments[itemKeys[i]];
    if (item.children) {
      count += item.children.length;
    }
  }

  return <div className={`${name}-text`}>
    {`${count} ${count === 1 ? lang.t('comment') : lang.t('comment-plural')}`}
  </div>;
};

export default CommentCount;

const lang = new I18n(translations);
