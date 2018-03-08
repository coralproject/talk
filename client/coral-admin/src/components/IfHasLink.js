import React from 'react';
import { matchLinks } from '../utils';

export default ({ text, children }) => {
  const hasLinks = !!matchLinks(text);

  if (!hasLinks) {
    return null;
  }

  return React.Children.only(children);
};
