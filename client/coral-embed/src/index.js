// Polyfill IntersectionObserver always, the alternative is that we have to also
// polyfill for Promise, which itself adds 1KB gziped, which means that the
// 4KB that the intersection observer really doesn't take up that much in terms
// of size.
import 'intersection-observer';

import Bridge from './Bridge';
import wrapBridge from './wrapBridge';

/**
 * validateElement will throw an error when the element is not configured
 * correctly or is not an HTMLElement at all.
 *
 * @param {HTMLElement} element the HTMLElement where the stream will be rendered
 */
function validateElement(element) {
  if (!element) {
    throw new Error(
      'Please provide Coral.Talk.render() the HTMLElement you want to render Talk in.'
    );
  }

  if (typeof element !== 'object') {
    throw new Error(
      `Coral.Talk.render() expected HTMLElement but got ${element} (${typeof element})`
    );
  }

  // Ensure element has an id, as pym can't directly accept the HTMLElement.
  if (!element.id) {
    element.id = `_${Math.random()}`;
  }
}

/**
 * validateConfig is the configuration validation tool.
 *
 * @param {Object} config the configuration that will be used to setup Talk.
 */
function validateConfig(config) {
  if (!config || typeof config !== 'object' || !config.talk) {
    throw new Error(
      'Coral.Talk.render() expected configuration with at least opts.talk as the Talk Base URL, none found'
    );
  }
}

export const Talk = {
  /**
   * Render a Talk stream
   * @param {HTMLElement} element - Element to render the stream in
   * @param {Object} config - Configuration options for talk
   * @param {String} config.talk - URL to the Talk installation
   * @param {String} [config.asset_id] - (optional) ID for the Asset
   * @param {String} [config.asset_url] - (optional) URL where the Asset is located
   * @param {String} [config.auth_token] - (optional) A jwt representing the session
   * @param {String} [config.lazy] - (optional) If set the stream will only render lazily
   * @param {String} [config.talkStaticUrl] - (optional) Static URL used to serve Talk
   * @return {Object}
   */
  render: (element, config) => {
    // Validate the element.
    validateElement(element);

    // Validate the configuration.
    validateConfig(config);

    // Create the new Bridge, and wrap it up.
    return wrapBridge(new Bridge(element, config));
  },
};
