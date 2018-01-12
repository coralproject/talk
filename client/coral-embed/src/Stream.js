import queryString from 'query-string';
import pym from 'pym.js';
import EventEmitter from 'eventemitter2';
import { buildUrl } from 'coral-framework/utils/url';
import Snackbar from './Snackbar';
import {
  createStorage,
  connectStorageToPym,
} from 'coral-framework/services/storage';

const NOTIFICATION_OFFSET = 200;

// Build the URL to load in the pym iframe.
function buildStreamIframeUrl(talkBaseUrl, query) {
  let url = [
    talkBaseUrl,
    talkBaseUrl.match(/\/$/) ? '' : '/', // make sure no double-'/' if opts.talk already ends with '/'
    'embed/stream?',
  ].join('');

  url += queryString.stringify(query);

  return url;
}

// Get dimensions of viewport.
function viewportDimensions() {
  let e = window,
    a = 'inner';
  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }

  return {
    width: e[`${a}Width`],
    height: e[`${a}Height`],
  };
}

export default class Stream {
  constructor(el, talkBaseUrl, query, config) {
    this.query = query;

    // Extract the non-opts opts from the object.
    const {
      events = null,
      snackBarStyles = null,
      onAuthChanged = null,
      ...opts
    } = config;

    this.opts = opts;

    this.emitter = new EventEmitter({ wildcard: true });
    this.pym = new pym.Parent(el.id, buildStreamIframeUrl(talkBaseUrl, query), {
      title: opts.title,
      id: `${el.id}_iframe`,
      name: `${el.id}_iframe`,
    });
    this.snackBar = new Snackbar(snackBarStyles || {});

    // Workaround: IOS Safari ignores `width` but respects `min-width` value.
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

    // Attach to the events emitted by the pym parent.
    if (events) {
      events(this.emitter);
    }

    this.pym.onMessage('getConfig', () => {
      this.pym.sendMessage('config', JSON.stringify(opts));
    });

    // If the auth changes, and someone is listening for it, then re-emit it.
    if (onAuthChanged) {
      this.pym.onMessage('coral-auth-changed', message => {
        onAuthChanged(message ? JSON.parse(message) : null);
      });
    }

    // Attach the snackbar to the pym parent and to the body of the page.
    this.snackBar.attach(window.document.body, this.pym);

    // Remove the permalink comment id from the hash.
    this.pym.onMessage('coral-view-all-comments', () => {
      const search = queryString.stringify({
        ...queryString.parse(location.search),
        commentId: undefined,
      });

      // Remove the commentId url param.
      const url = buildUrl({ ...location, search });

      // Change the url.
      window.history.replaceState({}, document.title, url);
    });

    // Remove the permalink comment id from the hash.
    this.pym.onMessage('coral-view-comment', id => {
      const search = queryString.stringify({
        ...queryString.parse(location.search),
        commentId: id,
      });

      // Remove the commentId url param.
      const url = buildUrl({ ...location, search });

      // Change the url.
      window.history.replaceState({}, document.title, url);
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
      window.open(url, '_blank').focus();
    });

    // Pass events from iframe to the event emitter.
    this.pym.onMessage('event', raw => {
      const { eventName, value } = JSON.parse(raw);
      this.emitter.emit(eventName, value);
    });

    // If the user clicks outside the embed, then tell the embed.
    document.addEventListener('click', this.handleClick.bind(this), true);

    // Listens to storage requests on pym and relay it to local storage.
    connectStorageToPym(createStorage(), this.pym);
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
  }

  handleClick() {
    this.pym.sendMessage('click');
  }
}
