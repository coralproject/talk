import React from 'react';
import matchLinks from 'coral-framework/utils/matchLinks';

export default ({ text, children }) => {
  const hasLinks = !!matchLinks(text);

  if (!hasLinks) {
    return null;
  }

  return React.Children.only(children);
};
