import React from 'react';
import PropTypes from 'prop-types';
import { matchLinks } from '../utils';
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
function markLinks(body) {
  const matches = matchLinks(body);
  const content = [];
  let index = 0;
  if (matches) {
    matches.forEach((match, i) => {
      content.push(body.substring(index, match.index));
      content.push(<mark key={i}>{match.text}</mark>);
      index = match.lastIndex;
    });
  }
  content.push(body.substring(index));
  return content;
}

const CommentFormatter = ({
  body,
  suspectWords,
  bannedWords,
  className = 'comment',
  ...rest
}) => {
  // Breaking the body by line break
  const textbreaks = body.split('\n');

  return (
    <span className={`${className}-text`} {...rest}>
      {textbreaks.map((line, i) => {
        const content = markLinks(line).map((element, index) => {
          // Keep highlighted links.
          if (typeof element !== 'string') {
            return element;
          }

          // Highlight suspect and banned phrase inside this part of text.
          return markPhrases(element, suspectWords, bannedWords, index);
        });

        return (
          <span key={i} className={`${className}-line`}>
            {content}
            {i !== textbreaks.length - 1 && (
              <br className={`${className}-linebreak`} />
            )}
          </span>
        );
      })}
    </span>
  );
};

CommentFormatter.propTypes = {
  className: PropTypes.string,
  bannedWords: PropTypes.array,
  suspectWords: PropTypes.array,
  body: PropTypes.string,
};

export default CommentFormatter;
