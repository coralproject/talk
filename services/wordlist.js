const debug = require('debug')('talk:services:wordlist');
const _ = require('lodash');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const Setting = require('../models/setting');

/**
 * The root wordlist object.
 * @type {Object}
 */
const wordlist = {
  list: [],
  enabled: false
};

/**
 * Loads wordlists in from the naughty-words package based on languages
 * selected.
 * @param  {Array} languages language codes to add to the wordlist
 */
wordlist.init = () => {
  return Setting
    .getSettings()
    .then((settings) => {

      // Insert the settings wordlist.
      wordlist.insert(settings.wordlist);
    });
};

/**
 * Inserts the wordlist data and enables the wordlist.
 * @param  {Array} list list of words to be added to the wordlist
 */
wordlist.insert = (list) => {

  // Add the words to this array, but also lowercase the words so that an
  // easy comparison can take place.
  wordlist.list = _.uniq(wordlist.list.concat(list.map((word) => {
    return tokenizer.tokenize(word.toLowerCase());
  })));

  debug(`Added ${list.length} words to the wordlist, now the wordlist is ${wordlist.list.length} entries long.`);

  // Enable the wordlist.
  wordlist.enabled = true;

  return Promise.resolve(wordlist);
};

/**
 * Tests the phrase to see if it contains any of the defined blockwords.
 * @param  {String} phrase value to check for blockwords.
 * @return {Boolean}       true if a blockword is found, false otherwise.
 */
wordlist.match = (phrase) => {

  // Lowercase the word to ensure that we don't miss a match due to
  // capitalization.
  let lowerPhraseWords = tokenizer.tokenize(phrase.toLowerCase());

  // This will return true in the event that at least one blockword is found
  // in the phrase.
  return wordlist.list.some((blockphrase) => {

    // First, let's see if we can find the first word in the blockphrase in the
    // source phrase.
    let idx = lowerPhraseWords.indexOf(blockphrase[0]);

    if (idx === -1) {

      // The first blockword in the blockphrase did not match the source phrase
      // anywhere.
      return false;
    }

    // Here we'll quick respond with true in the event that the blockphrase was
    // just a single word.
    if (blockphrase.length === 1) {
      return true;
    }

    // We found the first word in the source phrase! Lets ensure it matches the
    // rest of the blockphrase...

    // Check to see if it even has the length to support this word!
    if (lowerPhraseWords.length < idx + blockphrase.length - 1) {

      // We couldn't possibly have the entire phrase here because we don't have
      // enough entries!
      return false;
    }

    for (let i = 1; i < blockphrase.length; i++) {

      // Check to see if the next word also matches!
      if (lowerPhraseWords[idx + i] !== blockphrase[i]) {
        return false;
      }
    }

    // We've walked over all the words of the blockphrase, and haven't had a
    // mismatch... It does contain the whole word!
    return true;
  });
};

// ErrContainsProfanity is returned in the event that the middleware detects
// profanity/wordlisted words in the payload.
const ErrContainsProfanity = new Error('contains profanity');
ErrContainsProfanity.status = 400;

/**
 * Connect middleware for scanning request bodies for wordlisted words and
 * attaching a ErrContainsProfanity to the req.wordlisted parameter, otherwise
 * it will just set that parameter to false.
 * @param  {Array} fields selectors for the body to extract the fields to be
 *                        tested
 * @return {Function}     the Connect middleware
 */
wordlist.filter = (...fields) => (req, res, next) => {

  // Start with the sensible default that the content does not contain
  // profanity.
  req.wordlist = {
    matched: false
  };

  // If the wordlist isn't enabled, then don't actually perform checking and
  // forward the request!
  if (!wordlist.enabled) {
    return next();
  }

  // Loop over all the fields from the body that we want to check.
  const containsProfanity = fields.some((field) => {
    let phrase = _.get(req.body, field, false);

    // If the field doesn't exist in the body, then it can't be profane!
    if (!phrase) {

      // Return that there wasn't a profane word here.
      return false;
    }

    // Check if the field contains a profane word.
    if (wordlist.match(phrase)) {
      debug(`the field "${field}" contained a phrase "${phrase}" which contained a wordlisted word/phrase`);
      return true;
    }

    return false;
  });

  // The body could contain some profanity, address that here.
  if (containsProfanity) {
    req.wordlist.matched = ErrContainsProfanity;
  }

  next();
};

module.exports = wordlist;
module.exports.ErrContainsProfanity = ErrContainsProfanity;
