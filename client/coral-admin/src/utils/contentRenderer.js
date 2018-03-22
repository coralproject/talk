import React from 'react';
import { matchLinks } from './index';
import memoize from 'lodash/memoize';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// generate a regulare expression that catches the `phrases`.
function generateRegExp(phrases) {
  const inner = phrases
    .map(phrase =>
      phrase
        .split(/\s+/)
        .map(word => escapeRegExp(word))
        .join('[\\s"?!.]+')
    )
    .join('|');

  const pattern = `(^|[^\\w])(${inner})(?=[^\\w]|$)`;
  try {
    return new RegExp(pattern, 'iu');
  } catch (_err) {
    // IE does not support unicode support, so we'll create one without.
    return new RegExp(pattern, 'i');
  }
}

// Generate a regular expression detecting `suspectWords` and `bannedWords` phrases.
function getPhrasesRegexp(suspectWords, bannedWords) {
  return generateRegExp([...suspectWords, ...bannedWords]);
}

// Memoized version as arguments rarely change.
const getPhrasesRegexpMemoized = memoize(getPhrasesRegexp);

function nl2br(body, keyPrefix) {
  const tokens = body.split('\n').reduce((tokens, t, i) => {
    if (i !== 0) {
      tokens.push(<br key={`${keyPrefix}_${i}`} />);
    }
    tokens.push(t);
    return tokens;
  }, []);
  return tokens;
}

// markPhrases looks for `supsectWords` and `bannedWords` inside `body` and highlights them by returning
// an array of React Elements.
function markPhrases(body, suspectWords, bannedWords, keyPrefix) {
  const regexp = getPhrasesRegexpMemoized(suspectWords, bannedWords);
  const tokens = body.split(regexp);
  return tokens.map(
    (token, i) =>
      i % 3 === 2 ? <mark key={`${keyPrefix}_${i}`}>{token}</mark> : token
  );
}

// markLinks looks for links inside `body` and highlights them by returning
// an array of React Elements.
function markLinks(body, keyPrefix) {
  const matches = matchLinks(body);
  const content = [];
  let index = 0;
  if (matches) {
    matches.forEach((match, i) => {
      content.push(body.substring(index, match.index));
      content.push(
        <mark key={`${keyPrefix}_${i}`}>
          <a href={match.url} target="_blank">
            {match.text}
          </a>
        </mark>
      );
      index = match.lastIndex;
    });
  }
  content.push(body.substring(index));
  return content;
}

export function renderText(body, suspectWords, bannedWords) {
  return nl2br(body).map((element, index) => {
    // Skip br tags.
    if (typeof element !== 'string') {
      return element;
    }
    return markLinks(element, index).map((element, index) => {
      // Keep highlighted links.
      if (typeof element !== 'string') {
        return element;
      }

      // Highlight suspect and banned phrase inside this part of text.
      return markPhrases(element, suspectWords, bannedWords, index);
    });
  });
}
