import React from 'react';
import PropTypes from 'prop-types';
import matchLinks from '../utils/matchLinks';
import memoize from 'lodash/memoize';
import cn from 'classnames';
import styles from './AdminCommentContent.css';

function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
        <a
          key={`${keyPrefix}_${i}`}
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match.text}
        </a>
      );
      index = match.lastIndex;
    });
  }
  content.push(body.substring(index));
  return content;
}

// markPhrasesHTML looks for `supsectWords` and `bannedWords` inside `text` and highlights them by returning
// a HTML string.
function markPhrasesHTML(text, suspectWords, bannedWords) {
  const regexp = getPhrasesRegexpMemoized(suspectWords, bannedWords);
  const tokens = text.split(regexp);
  if (tokens.length === 1) {
    return text;
  }
  return tokens
    .map(
      (token, i) =>
        i % 3 === 2 ? `<mark>${escapeHTML(token)}</mark>` : escapeHTML(token)
    )
    .join('');
}

// markHTMLNode manipulates the node by looking for #text nodes and adding markers
// for `supsectWords` and `bannedWords`.
function markHTMLNode(parentNode, suspectWords, bannedWords) {
  parentNode.childNodes.forEach(node => {
    if (node.nodeName === '#text') {
      const newContent = markPhrasesHTML(
        node.textContent,
        suspectWords,
        bannedWords
      );
      if (newContent !== node.textContent) {
        const newNode = document.createElement('span');
        newNode.innerHTML = newContent;
        parentNode.replaceChild(newNode, node);
      }
    } else {
      markHTMLNode(node, suspectWords, bannedWords);
    }
  });
}

// renderText performs all the marking of a text body and returns an array of React Elements.
function renderText(body, suspectWords, bannedWords) {
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

const commonPropTypes = {
  className: PropTypes.string,
  bannedWords: PropTypes.array.isRequired,
  suspectWords: PropTypes.array.isRequired,
  body: PropTypes.string.isRequired,
};

const AdminCommentContentText = ({
  body,
  className,
  suspectWords,
  bannedWords,
}) => {
  return (
    <div className={cn(className, styles.content)}>
      {renderText(body, suspectWords, bannedWords)}
    </div>
  );
};
AdminCommentContentText.propTypes = commonPropTypes;

const AdminCommentContentHTML = ({
  body,
  className,
  suspectWords,
  bannedWords,
}) => {
  // We create a Shadow DOM Tree with the HTML body content and
  // use it as a parser.
  const node = document.createElement('div');
  node.innerHTML = body;

  // Then we traverse it recursively and manipulate it to highlight suspect words
  // and banned words.
  markHTMLNode(node, suspectWords, bannedWords);

  // Finally we render the content of the Shadow DOM Tree
  return (
    <div
      className={cn(className, styles.content)}
      dangerouslySetInnerHTML={{ __html: node.innerHTML }}
    />
  );
};
AdminCommentContentHTML.propTypes = commonPropTypes;

const AdminCommentContent = ({
  className,
  body,
  suspectWords,
  bannedWords,
  html,
}) => {
  const Component = html ? AdminCommentContentHTML : AdminCommentContentText;
  return (
    <Component
      className={className}
      body={body}
      suspectWords={suspectWords}
      bannedWords={bannedWords}
    />
  );
};

AdminCommentContent.propTypes = {
  ...commonPropTypes,
  html: PropTypes.bool,
};

export default AdminCommentContent;
