import React from 'react';
import {linkRegexp} from '../utils/regexp';

const wordSeperator = /([.\s'"?!])/;

function markWords(body, words, index) {
  const tokens = body.split(wordSeperator);
  const content = [];
  let tmp = [];
  tokens.forEach((token, i) => {
    if (words.indexOf(token.toLowerCase()) >= 0) {
      content.push(...tmp);
      tmp = [];
      content.push(<mark key={`${index}_${i}`}>{token}</mark>);
      return;
    }
    tmp.push(token);
  });
  content.push(...tmp);
  return content;
}

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
  const content = markLinks(body)
    .map((element, index) => {
      if (typeof element !== 'string') {
        return element;
      }
      return markWords(element, words, index);
    });
  return (
    <div {...rest}>
      {content}
    </div>
  );
};
