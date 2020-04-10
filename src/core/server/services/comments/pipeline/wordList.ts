import { LanguageCode } from "coral-common/helpers";
import createWordListRegExp from "coral-common/utils/createWordListRegExp";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";

interface Lists {
  banned: RegExp | false;
  suspect: RegExp | false;
}

export type Options = Pick<Tenant, "id" | "locale" | "wordList">;

export class WordList {
  private readonly cache = new WeakMap<Options, Lists>();

  private generate(locale: LanguageCode, list: string[]) {
    // If a word list has no entries, then we can make a simple tester.
    if (list.length === 0) {
      return false;
    }

    return createWordListRegExp(locale, list);
  }

  /**
   * create will create the List's.
   *
   * @param options options used to generate Lists
   */
  private create(options: Options): Lists {
    return {
      banned: this.generate(options.locale, options.wordList.banned),
      suspect: this.generate(options.locale, options.wordList.suspect),
    };
  }

  /**
   * lists will create/return a cached set of testers for the provided word
   * lists.
   *
   * @param options the options object that is also used as the cache key
   */
  private lists(options: Options, cache: boolean): Lists {
    // If the request isn't supposed to use the cache, then just return a new
    // one.
    if (!cache) {
      return this.create(options);
    }

    // As this is supposed to be cached, try to get it from the cache, or create
    // it.
    let lists = this.cache.get(options);
    if (!lists) {
      const timer = createTimer();
      lists = this.create(options);
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
   * @param testString the string to test to see if they match anything on the
   *                   list
   * @param cache when true, will re-use the cached testers based on the lists
   */
  public test(
    options: Options,
    listName: keyof Lists,
    testString: string,
    cache = true
  ): boolean {
    const list = this.lists(options, cache)[listName];
    if (!list) {
      return false;
    }

    const timer = createTimer();
    const result = list.test(testString);
    logger.info(
      { tenantID: options.id, listName, took: timer() },
      "word list phrase test complete"
    );

    return result;
  }
}
