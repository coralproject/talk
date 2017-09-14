import React from 'react';
import {matchLinks} from '../utils';
import memoize from 'lodash/memoize';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// generate a regulare expression that catches the `phrases`.
function generateRegExp(phrases) {
  const inner = phrases
    .map((phrase) =>
      phrase.split(/\s+/)
        .map((word) => escapeRegExp(word))
        .join('[\\s"?!.]+')
    ).join('|');

  return new RegExp(`(^|[^\\w])(${inner})(?=[^\\w]|$)`, 'iu');
}

// Generate a regular expression detecting `suspectWords` and `bannedWords` phrases.
function getPhrasesRegexp(suspectWords, bannedWords) {
  return generateRegExp([...suspectWords, ...bannedWords]);
}

// Memoized version as arguments rarely change.
const getPhrasesRegexpMemoized = memoize(getPhrasesRegexp);

// markPhrases looks for `supsectWords` and `bannedWords` inside `body` and highlights them by returning
// an array of React Elements.
function markPhrases(body, suspectWords, bannedWords, keyPrefix) {
  const regexp = getPhrasesRegexpMemoized(suspectWords, bannedWords);
  const tokens = body.split(regexp);
  return tokens.map((token, i) =>
    i % 3 === 2
      ? <mark key={`${keyPrefix}_${i}`}>{token}</mark>
      : token
  );
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

  // First highlight links.
  const content = markLinks(body)
    .map((element, index) => {

      // Keep highlighted links.
      if (typeof element !== 'string') {
        return element;
      }

      // Highlight suspect and banned phrase inside this part of text.
      return markPhrases(element, suspectWords, bannedWords, index);
    });
  return (
    <div {...rest}>
      {content}
    </div>
  );
};
