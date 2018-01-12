import URLSearchParams from 'url-search-params';
import Stream from './Stream';
import StreamInterface from './StreamInterface';

// Rebuild the origin if it isn't defined. This is our poor-mans polyfill
// for the location API's.
if (!window.location.origin) {
  window.location.origin = `${window.location.protocol}//${
    window.location.hostname
  }${window.location.port ? `:${window.location.port}` : ''}`;
}

// parses the Asset URL from the config variable
function parseAssetURL() {
  try {
    // Try to get the url from the canonical tag on the page.
    return document.querySelector('link[rel="canonical"]').href;
  } catch (e) {
    console.warn(
      'This page does not include a canonical link tag. Talk has inferred this asset_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages.'
    );

    return window.location.origin + window.location.pathname;
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
      throw new Error(
        'Please provide Coral.Talk.render() the HTMLElement you want to render Talk in.'
      );
    }
    if (typeof element !== 'object') {
      throw new Error(
        `Coral.Talk.render() expected HTMLElement but got ${element} (${typeof element})`
      );
    }
    if (!config || typeof config !== 'object' || !config.talk) {
      throw new Error(
        'Coral.Talk.render() expected configuration with at least opts.talk as the Talk Base URL, none found'
      );
    }

    // Ensure el has an id, as pym can't directly accept the HTMLElement.
    if (!element.id) {
      element.id = `_${Math.random()}`;
    }

    // Compose the query to send down to the Talk API so it knows what to load.
    const query = {};

    // Parse the url parameters to extract some of the information.
    const search = new URLSearchParams(window.location.search);

    // Pull the commentID out from the query params.
    const commentID = search.get('commentId') || search.get('commentID');
    if (commentID) {
      query.comment_id = commentID;
    }

    // Extract the asset id from the options.
    if (config.asset_id) {
      query.asset_id = config.asset_id;
    }

    // Parse the Asset URL.
    query.asset_url = config.asset_url;
    if (!query.asset_url) {
      query.asset_url = parseAssetURL();
    }

    // Create the new Stream.
    const stream = new Stream(element, config.talk, query, config);

    // Return the public interface for the stream.
    return new StreamInterface(stream);
  }
}
