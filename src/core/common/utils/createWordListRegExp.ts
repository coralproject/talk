import { defaults } from "lodash";

import { LanguageCode } from "coral-common/helpers";
import { DeepPartial } from "coral-common/types";

interface WordListRule {
  split: string;
  punctuation: string;
  whitespace: string;
}

const DefaultWordListRule: WordListRule = {
  split: "[^\\w]",
  punctuation: '[\\s"?!.]+',
  whitespace: "\\s+",
};

const WordListRules: DeepPartial<Record<LanguageCode, WordListRule>> = {
  "en-US": DefaultWordListRule,
};

/**
 * Escape string for special regular expression characters.
 *
 * @param str the string to escape from regex characters
 */
function escapeRegExp(str: string) {
  // $& means the whole matched string
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * generateRegExp will generate the tester that can be used to test strings
 * for matches on phrases.
 *
 * @param lang the language to possibly swap word list rules
 * @param phrases the phrases to use for creating the expression
 */
export default function createWordListRegExp(
  lang: LanguageCode,
  phrases: string[]
) {
  // Get the rule list for this language, fallback to english if we haven't
  // provided any overrides.
  const rule: WordListRule = defaults(
    WordListRules[lang] || {},
    DefaultWordListRule
  );

  const whitespace = new RegExp(rule.whitespace);

  // Split up the words from the list into a regex escaped string.
  const words = phrases
    .map(phrase =>
      phrase
        // Split each phrase by whitespace.
        .split(whitespace)
        // Escape each phrase, we don't expect any of them to contain regex.
        .map(word => escapeRegExp(word))
        // Rejoin to ensure that any variation of the word separated by a
        // punctuation character should also be caught.
        .join(rule.punctuation)
    )
    // For each of these words, wrap a `|` or OR.
    .join("|");

  // Wrap the pattern in split rules.
  const pattern = `(^|${rule.split})(${words})($|${rule.split})`;

  try {
    return new RegExp(pattern, "iu");
  } catch {
    // IE does not support unicode support, so we'll create one without.
    return new RegExp(pattern, "i");
  }
}
