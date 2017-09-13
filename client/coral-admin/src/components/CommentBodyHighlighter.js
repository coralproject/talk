import React from 'react';
import {matchLinks} from '../utils';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function generateRegExp(phrases) {
  const inner = phrases
    .map((phrase) => {
      return phrase.split(/\s+/)
        .map((word) => escapeRegExp(word))
        .join('[\\s"?!.]+');
    }).join('|');

  return `(^|[^\\w])(${inner})(?=[^\\w]|$)`;
}

// markPhrases looks for `phrases` inside `body` and highlights them by returning
// an array of React Elements.
function markPhrases(body, phrases, keyPrefix) {
  const regexp = new RegExp(generateRegExp(phrases), 'iu');
  const tokens = body.split(regexp);
  return tokens.map((token, i) => {
    if (i % 3 === 2) {
      return <mark key={`${keyPrefix}_${i}`}>{token}</mark>;
    }
    return token;
  });
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
  const phrases = [...suspectWords, ...bannedWords];

  // First highlight links.
  const content = markLinks(body)
    .map((element, index) => {

      // Keep highlighted links.
      if (typeof element !== 'string') {
        return element;
      }

      // Highlight suspect and banned phrase inside this part of text.
      return markPhrases(element, phrases, index);
    });
  return (
    <div {...rest}>
      {content}
    </div>
  );
};
