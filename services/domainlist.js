const debug = require('debug')('talk:services:domainlist');
const _ = require('lodash');
const SettingsService = require('./settings');

/**
 * The root domainlist object.
 * @type {Object}
 */
class Domainlist {

  constructor() {
    this.lists = {
      whitelist: [],
    };
  }

  /**
   * Loads domains white list in from the database
   */
  load() {
    return SettingsService
      .retrieve()
      .then((settings) => {

        // Insert the settings domains whitelist.
        this.upsert(settings.domains);
      });
  }

  /**
   * Inserts the domains whitelist data
   * @param  {Array} list list of domains to be set to the whitelist
   */
  upsert(lists) {

    // Add the domains to this array and also be sure are all unique domains
    if (!('whitelist' in lists)) {
      return;
    }

    this.lists['whitelist'] = Domainlist.parseList(lists['whitelist']);
    debug(`Added ${lists['whitelist'].length} domains to the whitelist.`);

    return Promise.resolve(this);
  }

  /**
   * Tests the url to see if it contains any of the whitelisted domains.
   * @param  {String} url   value to match.
   * @return {Boolean}      true if the url contains any of the domains, false otherwise.
   */
  match(list, url) {

    const domainToMatch = Domainlist.parseURL(url);

    // This will return true in the event that at least one blockword is found
    // in the phrase.
    return list.every((domain) => {

      // Not considering wildcards for now.
      if (domain === domainToMatch) {
        return true;
      }

      // We've walked over all the whitelisted domains, and haven't had a
      // mismatch... It is not an allowed domain!
      return false;
    });
  }

  /**
   * Parses the list content.
   * @param  {Array} list array of domains to parse for a list.
   * @return {Array}      the parsed list
   */
  static parseList(list) {
    return _.uniq(list.map((domain) => Domainlist.parseURL(domain)));
  }

  /**
   * Parses the URL.
   * @param  {String} url url to parse for a domain.
   * @return {String}      the domain
   */
  static parseURL(url){
    let domain;

    // removes protocol and get domain
    if (url.indexOf('://') > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }

    // remove port number
    domain = domain.split(':')[0];

    return domain.toLowerCase();
  }

  static urlCheck(url) {
    const dl = new Domainlist();

    return dl.load()
      .then(() => {
        return dl.match(dl.lists['whitelist'], url);
      });
  }

}

module.exports = Domainlist;
