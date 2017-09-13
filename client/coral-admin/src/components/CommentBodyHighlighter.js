import React from 'react';
import {matchLinks} from '../utils';

const capturingWordSeparator = /([.\s'"?!])/;
const wordSeparator = /[.\s'"?!]/;

// markPhrases looks for `phrases` inside `body` and highlights them by returning
// an array of React Elements.
function markPhrases(body, phrases, keyPrefix) {
  const tokens = body.split(capturingWordSeparator);
  const phraseWords = phrases.map((phrase) => phrase.toLowerCase().split(wordSeparator));
  const content = [];
  let tmp = [];

  for (let l = 0; l < tokens.length; l++) {

    // matchedWords is > 0 when a full match was found and contains
    // the range length from this index to the end of the match.
    let matchedWords = 0;

    // Skip word separators and ''.
    if (tokens[l] !== '' && !tokens[l].match(wordSeparator)) {
      for (let m = 0; m < phraseWords.length; m++) {
        const words = phraseWords[m];

        // We try to match the full phrase, index keeps track
        // of where we are now on the tokens array while matching
        // the words of the phrase.
        let index = l;
        for (let n = 0; n < words.length; n++, index++) {

          // Skip word separators and ''.
          while (index < tokens.length && (tokens[index].match(wordSeparator) || tokens[index] === '')) {
            index++;
          }

          // No more tokens left.
          if (index >= tokens.length) {
            break;
          }

          const token = tokens[index].toLowerCase();
          const word = words[n];
          if (token !== word) {
            break;
          }

          // Full match!
          if (n === words.length - 1) {

            // Save the matched range length into matched words.
            matchedWords = index - l + 1;
            break;
          }
        }

        // We matched a word so break out the loop.
        if (matchedWords) {
          break;
        }
      }
    }

    // We have a match!
    if (matchedWords) {
      const match = tokens.slice(l, l + matchedWords).join('');

      // Append whatever we have in `tmp` and clear it.
      content.push(tmp.join(''));
      tmp = [];

      content.push(<mark key={`${keyPrefix}_${l}`}>{match}</mark>);

      // Move index further if we matched more than one word.
      l += matchedWords - 1;

      continue;
    }

    // No match, we just push this into `tmp`.
    tmp.push(tokens[l]);
  }

  // Append any non matched tokens currently in `tmp`.
  content.push(tmp.join(''));

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
