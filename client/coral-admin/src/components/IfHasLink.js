import React from 'react';
import Linkify from 'react-linkify';
const linkify = new Linkify();

export default ({text, children}) => {
  const hasLinks = !!linkify.getMatches(text);

  if (!hasLinks) {
    return null;
  }

  return React.Children.only(children);
};
