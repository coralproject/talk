import { toLower, uniqBy } from "lodash";

import { LanguageCode } from "coral-common/helpers";
import createWordListRegExp from "coral-common/utils/createWordListRegExp";
import { globalErrorReporter } from "coral-framework/lib/errors/reporter";

export interface GetPhrasesRegExpOptions {
  locale: string;
  wordList: {
    banned: ReadonlyArray<string>;
    suspect: ReadonlyArray<string>;
  };
}

export function getPhrasesRegExp({
  locale,
  wordList: { banned, suspect },
}: GetPhrasesRegExpOptions) {
  if (banned.length === 0 && suspect.length === 0) {
    return null;
  }

  // Because the banned and suspect word lists may sometimes overlap, we should
  // make this list as short as possible before compiling it into a RegExp.
  const phrases = uniqBy<string>([...banned, ...suspect], toLower);

  // The locale is passed down to us from the Graph, we can cast it to a
  // LanguageCode.
  return createWordListRegExp(locale as LanguageCode, phrases);
}

// Cache is used as a global validator to the cached RegExp used by the
// application. We expect that generally, there is only ever one word list used
// by the client at a time, so this ensures that we only re-create the word list
// if we must.
interface Cache {
  keys: {
    locale: string;
    suspect: ReadonlyArray<string>;
    banned: ReadonlyArray<string>;
  };
  value: RegExp | null;
}

const cache: Cache = {
  keys: {
    locale: "",
    suspect: [],
    banned: [],
  },
  value: null,
};

export default function (options: GetPhrasesRegExpOptions) {
  // We assume that the cache is valid unless one of the below checks fails.
  let expired = false;

  // Check the locale.
  if (cache.keys.locale !== options.locale) {
    cache.keys.locale = options.locale;
    expired = true;
  }

  // Check the banned words list.
  if (cache.keys.banned !== options.wordList.banned) {
    cache.keys.banned = options.wordList.banned;
    expired = true;
  }

  // Check the suspect words list.
  if (cache.keys.suspect !== options.wordList.suspect) {
    cache.keys.suspect = options.wordList.suspect;
    expired = true;
  }

  // If the cache is expired, or the value doesn't exist, regenerate it.
  if (expired) {
    try {
      cache.value = getPhrasesRegExp(options);
    } catch (err) {
      globalErrorReporter.report(err);
      return null;
    }
  }

  return cache.value;
}
