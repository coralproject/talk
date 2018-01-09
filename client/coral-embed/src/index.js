import URLSearchParams from 'url-search-params';
import Stream from './Stream';
import StreamInterface from './StreamInterface';

function parseAssetURL(config) {

  if (config.asset_url) {

    // Extract the asset url from the configuration.
    return config.asset_url;
  } else {

    // The asset url was not provided so we need to infer the asset url from // details on the page.
    try {
      return document.querySelector('link[rel="canonical"]').href;
    } catch (e) {
      console.warn(
        'This page does not include a canonical link tag. Talk has inferred this asset_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages.'
      );

      if (!window.location.origin) {
        window.location.origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
      }

      return window.location.origin + window.location.pathname;
    }
  }
}

export class Talk {

  /**
   * Render a Talk stream
   * @param {HTMLElement} element - Element to render the stream in
   * @param {Object} config - Configuration options for talk
   * @param {String} config.talk - Talk base URL
   * @param {String} [config.title] - Title of Stream (rendered in iframe)
   * @param {String} [config.asset_url] - Asset URL
   * @param {String} [config.asset_id] - Asset ID
   * @param {String} [config.auth_token] - (optional) A jwt representing the session
   * @return {Object}
   *
   * Example:
   * ```
   *   const embed = Talk.render(document.getElementById('talkStreamEmbed'), config);
   *
   *   // trigger a login with optional token.
   *   embed.login(token);
   *
   *   // trigger a logout.
   *   embed.logout();
   *
   *   // listen to events (in this case all events).
   *   embed.on('**', function(value) {
   *     console.log(this.event, value);
   *   });
   * ```
   */
  static render(element, config) {
    if (!element) {
      throw new Error('Please provide Coral.Talk.render() the HTMLElement you want to render Talk in.');
    }
    if (typeof element !== 'object') {
      throw new Error(`Coral.Talk.render() expected HTMLElement but got ${element} (${typeof element})`);
    }
    if (!config || typeof config !== 'object' || !config.talk) {
      throw new Error('Coral.Talk.render() expected configuration with at least opts.talk as the Talk Base URL, none found');
    }

    // Ensure el has an id, as pym can't directly accept the HTMLElement.
    if (!element.id) {
      element.id = `_${Math.random()}`;
    }

    // Compose the query to send down to the Talk API so it knows what to load.
    const query = {};

    // Parse the url parameters to extract some of the information.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('commentId')) {
      query.comment_id = urlParams.get('commentId');
    }

    // Extract the asset id from the options.
    if (config.asset_id) {
      query.asset_id = config.asset_id;
    }

    // Parse the Asset URL.
    query.asset_url = parseAssetURL(config);

    // Create the new Stream.
    const stream = new Stream(element, config.talk, query, config);

    // Return the public interface for the stream.
    return new StreamInterface(stream);
  }
}
