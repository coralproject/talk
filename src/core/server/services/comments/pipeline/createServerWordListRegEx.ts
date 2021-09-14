import { defaults } from "lodash";
import RE2 from "re2";

import { LanguageCode } from "coral-common/helpers";
import {
  DefaultWordListRule,
  escapeRegExp,
  WordListRule,
  WordListRules,
} from "coral-common/utils/createWordListRegExp";

/**
 * generateRegExp will generate the tester that can be used to test strings
 * for matches on phrases.
 *
 * @param lang the language to possibly swap word list rules
 * @param phrases the phrases to use for creating the expression
 */
export default function createServerWordListRegEx(
  lang: LanguageCode,
  phrases: string[]
) {
  // Get the rule list for this language, fallback to english if we haven't
  // provided any overrides.
  const rule: WordListRule = defaults(
    WordListRules[lang] || {},
    DefaultWordListRule
  );

  // Split up the words from the list into a regex escaped string.
  const words = phrases
    .map((phrase) =>
      phrase
        // Split each phrase by whitespace.
        .split(/\s/)
        // Escape each phrase, we don't expect any of them to contain regex.
        .map((word) => escapeRegExp(word))
        // Rejoin to ensure that any variation of the word separated by a
        // punctuation character should also be caught.
        .join(rule.punctuation)
    )
    // For each of these words, wrap a `|` or OR.
    .join("|");

  // Wrap the pattern in split rules. We want to match any word that either is
  // at the start of a string, or a word boundary. The word must also either be
  // at the end of the string or at another word boundary.
  const pattern = `(^|${rule.boundary})(${words})($|${rule.boundary})`;

  return new RE2(pattern);
}
