const debug = require('debug')('talk:services:domain_list');
const _ = require('lodash');
const Settings = require('./settings');

const { ROOT_URL } = require('../config');

/**
 * The root domainlist object.
 * @type {Object}
 */
class DomainList {
  constructor() {
    this.lists = {
      whitelist: [],
    };
  }

  /**
   * Loads domains white list in from the database
   */
  async load() {
    const { domains } = await Settings.select('domains');
    this.upsert(domains);
  }

  /**
   * Inserts the domains whitelist data
   * @param  {Array} list list of domains to be set to the whitelist
   */
  async upsert(lists) {
    // Add the domains to this array and also be sure are all unique domains
    if (!('whitelist' in lists)) {
      return;
    }

    this.lists.whitelist = DomainList.parseList(lists.whitelist);
    debug(`Added ${lists.whitelist.length} domains to the whitelist.`);
  }

  /**
   * Tests the url to see if it contains any of the whitelisted domains.
   * @param  {String} url   value to match.
   * @return {Boolean}      true if the url contains any of the domains, false otherwise.
   */
  match(list, url) {
    // Parse the url that we're matching with.
    const domainToMatch = DomainList.parseURL(url);

    // This will return true in the event that at least one blockword is found
    // in the phrase.
    return list.indexOf(domainToMatch) >= 0;
  }

  /**
   * Checks to see if the passed url matches the domain of the root path.
   *
   * @param {String} url
   * @returns {Boolean} true if the domains match
   */
  static matchMount(url) {
    return DomainList.parseURL(url) === DomainList.parseURL(ROOT_URL);
  }

  /**
   * Parses the list content.
   * @param  {Array} list array of domains to parse for a list.
   * @return {Array}      the parsed list
   */
  static parseList(list) {
    return _.uniq(list.map(domain => DomainList.parseURL(domain)));
  }

  /**
   * Parses the URL.
   * @param  {String} url url to parse for a domain.
   * @return {String}      the domain
   */
  static parseURL(url) {
    let domain;

    // removes protocol and get domain
    if (url.indexOf('//') > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }

    // remove port number
    domain = domain.split(':')[0];

    return domain.toLowerCase();
  }

  static async urlCheck(url) {
    const dl = new DomainList();

    // Load the domain list.
    await dl.load();

    // Perform a match.
    return dl.match(dl.lists.whitelist, url);
  }
}

module.exports = DomainList;
