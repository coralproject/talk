import React from 'react';
import Highlighter from 'react-highlight-words';
import Linkify from 'react-linkify';
const linkify = new Linkify();

export default ({suspectWords, bannedWords, body, ...rest}) => {

  const links = linkify.getMatches(body);
  const linkText = links ? links.map((link) => link.raw) : [];

  // since words are checked against word boundaries on the backend,
  // should be the behavior on the front end as well.
  // currently the highlighter plugin does not support out of the box.
  const searchWords = [...suspectWords, ...bannedWords]
    .filter((w) => {
      return new RegExp(`(^|\\s)${w}(\\s|$)`, 'i').test(body);
    })
    .concat(linkText);

  return (
    <Highlighter
      {...rest}
      searchWords={searchWords}
      textToHighlight={body}
    />
  );
};
