import React from 'react';
import {matchLinks} from '../utils';

const wordSeperator = /([.\s'"?!])/;

// markWords looks for `words` inside `body` and highlights them by returning
// an array of React Elements.
function markWords(body, words, keyPrefix) {
  const tokens = body.split(wordSeperator);
  const content = [];
  let tmp = [];
  tokens.forEach((token, i) => {
    if (words.indexOf(token.toLowerCase()) >= 0) {
      content.push(...tmp);
      tmp = [];
      content.push(<mark key={`${keyPrefix}_${i}`}>{token}</mark>);
      return;
    }
    tmp.push(token);
  });
  content.push(...tmp);
  return content;
}

// markLinks looks for links inside `body` and highlights them by returning
// an array of React Elements.
function markLinks(body) {
  const matches = matchLinks(body);
  const content = [];
  let index = 0;
  if (matches) {
    matches
      .forEach((match, i) => {
        content.push(body.substring(index, match.index));
        content.push(<mark key={i}>{match.text}</mark>);
        index = match.lastIndex;
      });
  }
  content.push(body.substring(index));
  return content;
}

export default ({suspectWords, bannedWords, body, ...rest}) => {
  const words = [...suspectWords, ...bannedWords].map((word) => word.toLowerCase());

  // First highlight links.
  const content = markLinks(body)
    .map((element, index) => {

      // Keep highlighted links.
      if (typeof element !== 'string') {
        return element;
      }

      // Highlight suspect and banned words inside this part of text.
      return markWords(element, words, index);
    });
  return (
    <div {...rest}>
      {content}
    </div>
  );
};
