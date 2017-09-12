import React from 'react';
import {linkRegexp} from '../utils/regexp';

export default ({text, children}) => {
  const hasLinks = text.match(linkRegexp);

  if (!hasLinks) {
    return null;
  }

  return React.Children.only(children);
};
