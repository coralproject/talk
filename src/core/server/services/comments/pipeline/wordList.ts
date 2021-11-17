import { JSDOM } from "jsdom";

import { LanguageCode } from "coral-common/helpers";
import {
  ALL_FEATURES,
  createSanitize,
  WORDLIST_FORBID_TAGS,
} from "coral-common/helpers/sanitize";
import { createTimer } from "coral-server/helpers";
import createTesterWithTimeout, {
  MatchResult,
  TestWithTimeout,
} from "coral-server/helpers/createTesterWithTimeout";
import logger from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";

import createServerWordListRegEx from "./createServerWordListRegEx";

interface Lists {
  banned: TestWithTimeout | false;
  suspect: TestWithTimeout | false;
}

export type Options = Pick<Tenant, "id" | "locale" | "wordList">;

export class WordList {
  /**
   * cache is a weak map of word list options to word lists. It's a weak map
   * so when the tenant document is updated and the old tenant is discarded, the
   * list will also be discarded without explicit syncing by the garbage
   * collection system.
   */
  private readonly cache = new WeakMap<Options, Lists>();
  private readonly sanitizer = createSanitize(new JSDOM("", {}).window as any, {
    // We need normalized text nodes to mark nodes for suspect/banned words.
    normalize: true,
    // Allow all RTE features to be displayed.
    features: ALL_FEATURES,
    config: {
      FORBID_TAGS: WORDLIST_FORBID_TAGS,
    },
  });

  private generate(locale: LanguageCode, list: string[], timeout: number) {
    // If a word list has no entries, then we can make a simple tester.
    if (list.length === 0) {
      return false;
    }

    // Generate the regular expression for this list.
    const regexp = createServerWordListRegEx(locale, list);

    // Create a managed regular expression from the provided regular expression
    // so we can time it out if it takes too long!
    return createTesterWithTimeout(regexp, timeout);
  }

  /**
   * create will create the List's.
   *
   * @param options options used to generate Lists
   */
  private create(options: Options, timeout: number): Lists {
    return {
      banned: this.generate(options.locale, options.wordList.banned, timeout),
      suspect: this.generate(options.locale, options.wordList.suspect, timeout),
    };
  }

  /**
   * lists will create/return a cached set of testers for the provided word
   * lists.
   *
   * @param options the options object that is also used as the cache key
   */
  private lists(options: Options, cache: boolean, timeout: number): Lists {
    // If the request isn't supposed to use the cache, then just return a new
    // one.
    if (!cache) {
      return this.create(options, timeout);
    }

    // As this is supposed to be cached, try to get it from the cache, or create
    // it.
    let lists = this.cache.get(options);
    if (!lists) {
      const timer = createTimer();
      lists = this.create(options, timeout);
      logger.info(
        { tenantID: options.id, took: timer() },
        "regenerated word list cache"
      );

      this.cache.set(options, lists);
    }

    return lists;
  }

  /**
   * test will test the string against the selected list. The generated lists
   * are cached and re-used on subsequent calls.
   *
   * @param options the options object that is also used as the cache key
   * @param listName the list to test against
   * @param timeout the length of time that the test should wait for before
   *                aborting
   * @param testString the string to test to see if they match anything on the
   *                   list
   * @param cache when true, will re-use the cached testers based on the lists
   */
  public test(
    options: Options,
    listName: keyof Lists,
    timeout: number,
    testString: string,
    cache = true
  ): MatchResult {
    const test = this.lists(options, cache, timeout)[listName];
    if (!test) {
      return {
        isMatched: false,
        timedOut: false,
        matches: [],
      };
    }

    const timer = createTimer();

    const sanitizedTestString = this.sanitizer(testString).innerHTML;

    // Test the string against the list and timeout if it takes too long.
    const result = test(sanitizedTestString);
    if (result.timedOut) {
      logger.warn(
        {
          tenantID: options.id,
          listName,
          took: timer(),
          testString: sanitizedTestString,
        },
        "word list phrase test timed out"
      );
    } else {
      logger.info(
        { tenantID: options.id, listName, took: timer() },
        "word list phrase test complete"
      );
    }

    return result;
  }
}
