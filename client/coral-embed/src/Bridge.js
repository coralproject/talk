import queryString from 'querystringify';
import URLSearchParams from '@ungap/url-search-params';
import pym from 'pym.js';
import EventEmitter from 'eventemitter2';
import { buildUrl } from 'coral-framework/utils/url';
import SnackBar from './SnackBar';
import onIntersect from './onIntersect';
import {
  createStorage,
  connectStorageToPym,
} from 'coral-framework/services/storage';

// Rebuild the origin if it isn't defined. This is our poor-mans polyfill
// for the location APIs.
if (!window.location.origin) {
  window.location.origin = `${window.location.protocol}//${
    window.location.hostname
  }${window.location.port ? `:${window.location.port}` : ''}`;
}

const NOTIFICATION_OFFSET = 200;

// Ensure there is a trailing slash.
function ensureEndSlash(p) {
  return p.match(/\/$/) ? p : `${p}/`;
}

// Build the URL to load in the pym iframe.
function buildStreamIframeUrl(talkBaseUrl, query) {
  let url = talkBaseUrl + 'embed/stream?';

  url += queryString.stringify(query);

  return url;
}

// detectAssetURL will try to grab the canonical url from the head, if it isn't
// available, source the url from the current one.
function detectAssetURL() {
  try {
    // Try to get the url from the canonical tag on the page.
    return document.querySelector('link[rel="canonical"]').href;
  } catch (e) {
    window.console.warn(
      'This page does not include a canonical link tag. Talk has inferred this asset_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages.'
    );

    return window.location.origin + window.location.pathname;
  }
}

function buildQuery({ asset_id, asset_url }) {
  // Compose the query to send down to the Talk API so it knows what to load.
  const query = {};

  // Parse the url parameters to extract some of the information.
  const search = new URLSearchParams(window.location.search);

  // Pull the Comment ID out of the query string.
  const commentID = search.get('commentId') || search.get('commentID');
  if (commentID) {
    query.comment_id = commentID;
  }

  // Insert the asset_id into the query.
  if (asset_id) {
    query.asset_id = asset_id;
  }

  // If the asset_url is defined, use it, otherwise, detect it.
  if (asset_url) {
    query.asset_url = asset_url;
  } else {
    query.asset_url = detectAssetURL();
  }

  return query;
}

// Get dimensions of viewport.
function viewportDimensions() {
  let target = window;
  let prefix = 'inner';
  if (!('innerWidth' in window)) {
    prefix = 'client';
    target = document.documentElement || document.body;
  }

  return {
    width: target[`${prefix}Width`],
    height: target[`${prefix}Height`],
  };
}

export default class Bridge {
  constructor(
    element,
    {
      // Pull out the URLs used to setup Talk.
      talk: talkBaseUrl,
      talkStaticUrl = talkBaseUrl,
      // Default the following to null.
      events = null,
      snackBarStyles = null,
      onAuthChanged = null,
      // Determine if we're in lazy mode or not. By default, the build argument
      // will determine the lazy render status. This default is primarily used
      // when the embed code cannot be changed, but control of the Talk serving
      // domain is available.
      lazy = process.env.TALK_DEFAULT_LAZY_RENDER === 'TRUE',
      // Any additional options are extracted to be sent to the embed via the
      // pym bridge.
      ...opts
    }
  ) {
    this.pym = null;
    this.element = element;
    this.opts = opts;
    this.query = buildQuery(this.opts);
    this.emitter = new EventEmitter({ wildcard: true });
    this.snackBar = new SnackBar(snackBarStyles || {});
    this.onAuthChanged = onAuthChanged;
    this.talkBaseUrl = ensureEndSlash(talkBaseUrl);
    this.talkStaticUrl = ensureEndSlash(talkStaticUrl);
    this.lazy = lazy;

    // Store queued operations in a queue that can be processed once the stream
    // is rendered.
    this.queued = [];

    // Attach to the events emitted by the pym parent.
    if (events) {
      events(this.emitter);
    }

    // Start the embed loading process.
    if (this.lazy) {
      // When the dom element containing the talk embed container is in view,
      // render the stream with force turned on so that it skips this portion.
      onIntersect(this.element, () => this.load());
    } else {
      // We aren't being lazy, load it now!
      this.load();
    }
  }

  ensureRendered() {
    // Check to see if the pym bridge is created, and the embed is loaded.
    if (this.pym === null) {
      throw new Error('Stream Embed must be rendered first');
    }
  }

  queueWhenRendered(callback) {
    // Check to see if the queue is alive, if it isn't, run the callback now,
    // otherwise, push the callback to be processed when the stream has loaded.
    if (this.queued !== null) {
      this.queued.push(callback);
    } else {
      callback();
    }
  }

  setupPym() {
    const url = buildStreamIframeUrl(this.talkBaseUrl, this.query);
    this.pym = new pym.Parent(this.element.id, url, {
      title: this.opts.title,
      id: `${this.element.id}_iframe`,
      name: `${this.element.id}_iframe`,
    });

    // NOTE: Workaround for iOS Safari which ignores `width` but respects `min-width` value.
    this.pym.el.firstChild.style.width = '1px';
    this.pym.el.firstChild.style.minWidth = '100%';

    // Resize parent iframe height when child height changes
    let cachedHeight;
    this.pym.onMessage('height', height => {
      if (height !== cachedHeight) {
        this.pym.el.firstChild.style.height = `${height}px`;
        cachedHeight = height;
      }
    });

    // Send the config back over the pym bridge if requested.
    this.pym.onMessage('getConfig', () => {
      this.pym.sendMessage('config', JSON.stringify(this.opts));
    });

    // If the auth changes, and someone is listening for it, then re-emit it.
    if (this.onAuthChanged) {
      this.pym.onMessage('coral-auth-changed', message => {
        this.onAuthChanged(message ? JSON.parse(message) : null);
      });
    }

    // Remove the permalink comment id from the search.
    this.pym.onMessage('coral-view-all-comments', () => {
      const query = queryString.parse(location.search);

      // Remove the commentId/commentID url param.
      delete query.commentId;
      delete query.commentID;

      // Rebuild the search field without the commentId in it.
      const search = queryString.stringify(query);

      // Change the url.
      window.history.replaceState(
        {},
        document.title,
        buildUrl({ ...location, search })
      );
    });

    // Remove the permalink comment id from the hash.
    this.pym.onMessage('coral-view-comment', id => {
      const search = queryString.stringify({
        ...queryString.parse(location.search),
        commentId: id,
      });

      // Change the url to the permalink url.
      window.history.replaceState(
        {},
        document.title,
        buildUrl({ ...location, search })
      );
    });

    // Helps child show notifications at the right scrollTop.
    this.pym.onMessage('getPosition', () => {
      const { height } = viewportDimensions();
      let position = height + document.body.scrollTop;

      if (position > NOTIFICATION_OFFSET) {
        position = position - NOTIFICATION_OFFSET;
      }

      this.pym.sendMessage('position', position);
    });

    // When end-user clicks link in iframe, open it in parent context
    this.pym.onMessage('navigate', url => {
      // Open the new window, detach the opener, and focus on it.
      const w = window.open(url, '_blank');
      w.opener = null;
      w.focus();
    });

    // Pass events from iframe to the event emitter.
    this.pym.onMessage('event', raw => {
      const { eventName, value } = JSON.parse(raw);
      this.emitter.emit(eventName, value);
    });
  }

  /**
   * load will configure the pym parent if it hasn't already been, and setup the
   * snackBar. If there are any queued operations, it will run them first.
   */
  load() {
    if (this.pym !== null) {
      throw new Error('Stream Embed already rendered');
    }

    // Setup Pym.
    this.setupPym();

    // Attach the snackBar to the pym parent and to the body of the page.
    this.snackBar.attach(window.document.body, this.pym);

    // If the user clicks outside the embed, then tell the embed.
    document.addEventListener('click', this.handleClick.bind(this), true);

    // Listens to ${name}Storage requests on pym and relay it to
    // ${name}Storage.
    ['local', 'session'].forEach(name => {
      connectStorageToPym(
        createStorage(`${name}Storage`),
        this.pym,
        `${name}Storage`
      );
    });

    // Process any queued operations.
    const queued = this.queued;
    this.queued = null;
    queued.forEach(callback => callback());
  }

  handleClick() {
    this.pym.sendMessage('click');
  }

  enablePluginsDebug() {
    this.pym.sendMessage('enablePluginsDebug');
  }

  disablePluginsDebug() {
    this.pym.sendMessage('disablePluginsDebug');
  }

  login(token) {
    this.pym.sendMessage('login', token);
  }

  logout() {
    this.pym.sendMessage('logout');
  }

  remove() {
    // Remove the event listeners.
    document.removeEventListener('click', this.handleClick.bind(this));
    this.emitter.removeAllListeners();

    // Remove the snackbar.
    this.snackBar.remove();

    // Remove the pym parent.
    this.pym.remove();
    this.pym = null;
  }
}
