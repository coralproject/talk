const debug = require('debug')('talk:services:wordlist');
const _ = require('lodash');
const SettingsService = require('./settings');
const Errors = require('../errors');
const memoize = require('lodash/memoize');
const { escapeRegExp } = require('./regex');

/**
 * Generate a regulare expression that catches the `phrases`.
 */
function generateRegExp(phrases) {
  const inner = phrases
    .map(phrase =>
      phrase
        .split(/\s+/)
        .map(word => escapeRegExp(word))
        .join('[\\s"?!.]+')
    )
    .join('|');

  return new RegExp(`(^|[^\\w])(${inner})(?=[^\\w]|$)`, 'iu');
}

/**
 * Memoized version of generateRegExp.
 */
const generateRegExpMemoized = memoize(generateRegExp, phrases =>
  phrases.join(',')
);

/**
 * Never matching regexp that exits immediately.
 */
const neverMatch = /(?!)/;

/**
 * The root wordlist object.
 * @type {Object}
 */
class Wordlist {
  constructor() {
    this.regexp = {
      banned: neverMatch,
      suspect: neverMatch,
    };
  }

  /**
   * Loads wordlists in from the database
   */
  load() {
    return SettingsService.retrieve().then(settings => {
      // Insert the settings wordlist.
      this.upsert(settings.wordlist);
    });
  }

  /**
   * Inserts the wordlist data
   * @param  {Array} list list of words to be set to the wordlist
   */
  upsert(lists) {
    // Add the words to this array, but also lowercase the words so that an
    // easy comparison can take place.
    ['banned', 'suspect'].forEach(k => {
      if (!(k in lists)) {
        return;
      }

      this.regexp[k] =
        lists[k] && lists[k].length > 0
          ? generateRegExpMemoized(lists[k])
          : neverMatch;

      debug(`Added ${lists[k].length} words to the ${k} wordlist.`);
    });

    return Promise.resolve(this);
  }

  /**
   * Scans a specific field for wordlist violations.
   */
  scan(fieldName, phrase) {
    let errors = {};

    // If the field doesn't exist in the body, then it can't be profane!
    if (!phrase) {
      // Return that there wasn't a profane word here.
      return errors;
    }

    // Check if the field contains a banned word.
    if (this.regexp.banned.test(phrase)) {
      debug(
        `the field "${fieldName}" contained a phrase "${phrase}" which contained a banned word/phrase`
      );

      errors.banned = Errors.ErrContainsProfanity;

      // Stop looping through the fields now, we discovered the worst possible
      // situation (a banned word).
      return errors;
    }

    // Check if the field contains a suspected word.
    if (this.regexp.suspect.test(phrase)) {
      debug(
        `the field "${fieldName}" contained a phrase "${phrase}" which contained a suspected word/phrase`
      );

      errors.suspect = Errors.ErrContainsProfanity;

      // Continue looping through the fields now, we discovered a possible bad
      // word (suspect).
      return errors;
    }

    return errors;
  }

  /**
   * Perform the filtering based on the loaded wordlists.
   */
  filter(body, ...fields) {
    // Start with the sensible default that the content does not contain
    // profanity.
    let errors = {};

    // Loop over all the fields from the body that we want to check.
    for (let i = 0; i < fields.length; i++) {
      let fieldName = fields[i];

      let phrase = _.get(body, fieldName, false);

      // If the field doesn't exist in the body, then it can't be profane!
      if (!phrase) {
        // Return that there wasn't a profane word here.
        continue;
      }

      errors = Object.assign(errors, this.scan(fieldName, phrase));

      // Check if the field contains a banned word.
      if (errors.banned) {
        // Stop looping through the fields now, we discovered the worst possible
        // situation (a banned word).
        break;
      }

      // Check if the field contains a banned word.
      if (errors.suspect) {
        // Continue looping through the fields now, we discovered a possible bad
        // word (suspect).
        continue;
      }
    }

    return errors;
  }

  /**
   * check potential username for banned words
   */
  static usernameCheck(username) {
    const wl = new Wordlist();

    return wl.load().then(() => {
      if (wl.regexp.banned.test(username)) {
        return Errors.ErrContainsProfanity;
      }
    });
  }

  /**
   * Connect middleware for scanning request bodies for wordlisted words and
   * attaching a ErrContainsProfanity to the req.wordlisted parameter, otherwise
   * it will just set that parameter to false.
   * @param  {Array} fields selectors for the body to extract the fields to be
   *                        tested
   * @return {Function}     the Connect middleware
   */
  static filter(...fields) {
    return async (req, res, next) => {
      // Create a new instance of the Wordlist.
      const wl = new Wordlist();

      try {
        await wl.load();

        // Perform a filtering operation using the new instance of the
        // Wordlist.
        req.wordlist = wl.filter(req.body, ...fields);
      } catch (err) {
        return next(err);
      }

      // Call the next piece of middleware.
      return next();
    };
  }
}

module.exports = Wordlist;
