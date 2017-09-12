import React from 'react';
import {linkRegexp} from '../utils/regexp';

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

// markWords looks for links inside `body` and highlights them by returning
// an array of React Elements.
function markLinks(body) {
  const tokens = body.split(linkRegexp);
  const content = [];
  let tmp = [];
  tokens
    .filter((token) => token)
    .forEach((token, i) => {
      if (token.match(linkRegexp)) {
        content.push(...tmp);
        tmp = [];
        content.push(<mark key={i}>{token}</mark>);
        return;
      }
      tmp.push(token);
    });
  content.push(...tmp);
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
