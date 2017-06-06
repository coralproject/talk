import pym from 'pym.js';

import {stringify} from 'querystring';

// TODO: Styles should live in a separate file
const snackbarStyles = {
  position: 'fixed',
  cursor: 'default',
  userSelect: 'none',
  backgroundColor: '#323232',
  zIndex: 3,
  willChange: 'transform, opacity',
  transition: 'transform .35s cubic-bezier(.55,0,.1,1), opacity .35s',
  pointerEvents: 'none',
  padding: '12px 18px',
  color: '#fff',
  borderRadius: '3px 3px 0 0',
  textAlign: 'center',
  maxWidth: '400px',
  left: '50%',
  opacity: 0,
  transform: 'translate(-50%, 20px)',
  bottom: 0,
  boxSizing: 'border-box',
  fontFamily: 'Helvetica, "Helvetica Neue", Verdana, sans-serif'
};

// This function should return value of window.Coral
const Coral = {};
const Talk = (Coral.Talk = {});

// build the URL to load in the pym iframe
function buildStreamIframeUrl(talkBaseUrl, query) {
  let url = [
    talkBaseUrl,
    talkBaseUrl.match(/\/$/) ? '' : '/', // make sure no double-'/' if opts.talk already ends with '/'
    'embed/stream?'
  ].join('');

  url += stringify(query);

  return url;
}

// Set up postMessage listeners/handlers on the pymParent
// e.g. to resize the iframe, and navigate the host page
function configurePymParent(pymParent, opts) {
  let notificationOffset = 200;
  let cachedHeight;
  const snackbar = document.createElement('div');

  // Sends config to pymChild
  function sendConfig(config) {
    pymParent.sendMessage('config', JSON.stringify(config));
  }

  pymParent.onMessage('checkLogin', function(result) {
    if (opts.onAuthChange) {
      opts.onAuthChange(JSON.parse(result));
    }
  });

  // Sends config to the child
  pymParent.onMessage('getConfig', function() {
    sendConfig(opts || {});
  });

  snackbar.id = 'coral-notif';

  for (let key in snackbarStyles) {
    snackbar.style[key] = snackbarStyles[key];
  }

  window.document.body.appendChild(snackbar);

  // Workaround: IOS Safari ignores `width` but respects `min-width` value.
  pymParent.el.firstChild.style.width = '1px';
  pymParent.el.firstChild.style.minWidth = '100%';

  // Resize parent iframe height when child height changes
  pymParent.onMessage('height', function(height) {
    if (height !== cachedHeight) {
      pymParent.el.firstChild.style.height = `${height}px`;
      cachedHeight = height;
    }
  });

  pymParent.onMessage('coral-clear-notification', function() {
    snackbar.style.opacity = 0;
  });

  // remove the permalink comment id from the hash
  pymParent.onMessage('coral-view-all-comments', function() {
    window.history.replaceState(
      {},
      document.title,
      location.origin + location.pathname + location.search
    );
  });

  pymParent.onMessage('coral-alert', function(message) {
    const [type, text] = message.split('|');
    snackbar.style.transform = 'translate(-50%, 20px)';
    snackbar.style.opacity = 0;
    snackbar.className = `coral-notif-${type}`;
    snackbar.textContent = text;

    setTimeout(() => {
      snackbar.style.transform = 'translate(-50%, 0)';
      snackbar.style.opacity = 1;
    }, 0);

    setTimeout(() => {
      snackbar.style.opacity = 0;
    }, 5000);
  });

  // Helps child show notifications at the right scrollTop
  pymParent.onMessage('getPosition', function() {
    let position = viewport().height + document.body.scrollTop;

    if (position > notificationOffset) {
      position = position - notificationOffset;
    }

    pymParent.sendMessage('position', position);
  });

  // When end-user clicks link in iframe, open it in parent context
  pymParent.onMessage('navigate', function(url) {
    window.open(url, '_blank').focus();
  });

  // get dimensions of viewport
  const viewport = () => {
    let e = window, a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return {
      width: e[`${a}Width`],
      height: e[`${a}Height`]
    };
  };
}

/**
 * Render a Talk stream
 * @param {HTMLElement} el - Element to render the stream in
 * @param {Object} opts - Configuration options for talk
 * @param {String} opts.talk - Talk base URL
 * @param {String} [opts.title] - Title of Stream (rendered in iframe)
 * @param {String} [opts.asset_url] - Asset URL
 * @param {String} [opts.asset_id] - Asset ID
 * @param {String} [opts.auth_token] - (optional) A jwt representing the session
 */
Talk.render = function(el, opts) {
  if (!el) {
    throw new Error(
      'Please provide Coral.Talk.render() the HTMLElement you want to render Talk in.'
    );
  }
  if (typeof el !== 'object') {
    throw new Error(
      `Coral.Talk.render() expected HTMLElement but got ${el} (${typeof el})`
    );
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
  let query = {};

  query.comment_id = window.location.hash.slice(1);
  query.asset_id = opts.asset_id;

  query.asset_url = opts.asset_url;
  if (!query.asset_url) {
    try {
      query.asset_url = document.querySelector('link[rel="canonical"]').href;
    } catch (e) {
      console.warn(
        'This page does not include a canonical link tag. Talk has inferred this asset_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages.'
      );
      query.asset_url = window.location.origin + window.location.pathname;
    }
  }

  configurePymParent(
    new pym.Parent(el.id, buildStreamIframeUrl(opts.talk, query), {
      title: opts.title,
      id: `${el.id}_iframe`,
      name: `${el.id}_iframe`
    }),
    opts
  );
};

export default Coral;
