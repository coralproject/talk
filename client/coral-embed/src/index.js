import URLSearchParams from 'url-search-params';
import Stream from './Stream';
import StreamInterface from './StreamInterface';

export class Talk {

  /**
   * Render a Talk stream
   * @param {HTMLElement} el - Element to render the stream in
   * @param {Object} opts - Configuration options for talk
   * @param {String} opts.talk - Talk base URL
   * @param {String} [opts.title] - Title of Stream (rendered in iframe)
   * @param {String} [opts.asset_url] - Asset URL
   * @param {String} [opts.asset_id] - Asset ID
   * @param {String} [opts.auth_token] - (optional) A jwt representing the session
   * @return {Object}
   *
   * Example:
   * ```
   *   const embed = Talk.render(document.getElementById('talkStreamEmbed'), opts);
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
  static render(el, opts) {
    if (!el) {
      throw new Error('Please provide Coral.Talk.render() the HTMLElement you want to render Talk in.');
    }
    if (typeof el !== 'object') {
      throw new Error(`Coral.Talk.render() expected HTMLElement but got ${el} (${typeof el})`);
    }

    opts = opts || {};

    // TODO: infer this URL without explicit user input (if possible, may have to be added at build/render time of this script)
    if (!opts.talk) {
      throw new Error(
        'Coral.Talk.render() expects opts.talk as the Talk Base URL'
      );
    }

    // Ensure el has an id, as pym can't directly accept the HTMLElement.
    if (!el.id) {
      el.id = `_${Math.random()}`;
    }

    // Compose the query to send down to the Talk API so it knows what to load.
    const query = {};

    // Parse the url parameters to extract some of the information.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('commentId')) {
      query.comment_id = urlParams.get('commentId');
    }

    // Extract the asset id from the options.
    if (opts.asset_id) {
      query.asset_id = opts.asset_id;
    }

    // Extract the asset url.
    if (opts.asset_url) {
      query.asset_url = opts.asset_url;
    } else if (!opts.asset_id) {

      // The asset url was not provided and the asset id was also not provided,
      // we need to infer the asset url from details on the page.

      try {
        query.asset_url = document.querySelector('link[rel="canonical"]').href;
      } catch (e) {
        console.warn(
          'This page does not include a canonical link tag. Talk has inferred this asset_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages.'
        );

        if (!window.location.origin) {
          window.location.origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
        }

        query.asset_url = window.location.origin + window.location.pathname;
      }
    }

    // Create the new Stream.
    const stream = new Stream(el, opts.talk, query, opts);

    // Return the public interface for the stream.
    return new StreamInterface(stream);
  }
}
