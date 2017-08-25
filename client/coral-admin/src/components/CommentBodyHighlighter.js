import React from 'react';
import Highlighter from 'react-highlight-words';
import Linkify from 'react-linkify';
const linkify = new Linkify();

export default ({suspectWords, bannedWords, body, ...rest}) => {

  const links = linkify.getMatches(body);
  const linkText = links ? links.map((link) => link.raw) : [];

  const searchWords = [
    ...suspectWords,
    ...bannedWords,
    ...linkText
  ];

  return (
    <Highlighter
      {...rest}
      autoEscape={true}
      searchWords={searchWords}
      textToHighlight={body}
    />
  );
};
