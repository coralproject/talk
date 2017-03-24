import pym from 'pym.js';

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
  boxSizing: 'border-box'
};

// This function should return value of window.Coral
const Coral = {};
const Talk = Coral.Talk = {};

// build the URL to load in the pym iframe
function buildStreamIframeUrl(talkBaseUrl, asset_url, comment, asset_id) {
  let iframeArray = [
    talkBaseUrl,
    (talkBaseUrl.match(/\/$/) ? '' : '/'), // make sure no double-'/' if opts.talk already ends with '/'
    'embed/stream?asset_url=',
    encodeURIComponent(asset_url)
  ];

  if (comment) {
    iframeArray.push('&comment_id=');
    iframeArray.push(encodeURIComponent(comment));
  }

  if (asset_id) {
    iframeArray.push('&asset_id=');
    iframeArray.push(encodeURIComponent(asset_id));
  }

  return iframeArray.join('');
}

// Set up postMessage listeners/handlers on the pymParent
// e.g. to resize the iframe, and navigate the host page
function configurePymParent(pymParent, asset_url) {
  let notificationOffset = 200;
  let ready = false;
  let cachedHeight;
  const snackbar = document.createElement('div');
  snackbar.id = 'coral-notif';

  for (let key in snackbarStyles) {
    snackbar.style[key] = snackbarStyles[key];
  }

  window.document.body.appendChild(snackbar);

  // Resize parent iframe height when child height changes
  pymParent.onMessage('height', function(height) {
    if (height !== cachedHeight) {
      pymParent.el.firstChild.style.height = `${height}px`;
      cachedHeight = height;
    }
  });

  pymParent.onMessage('coral-clear-notification', function () {
    snackbar.style.opacity = 0;
  });

  pymParent.onMessage('coral-alert', function (message) {
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

  // Tell child when parent's DOMContentLoaded
  pymParent.onMessage('childReady', function () {
    const interval = setInterval(function () {
      if (ready) {
        window.clearInterval(interval);

        // @todo - It's weird to me that this is sent here in addition to the iframe URL. Could it just be in one place?
        pymParent.sendMessage('DOMContentLoaded', asset_url);
      }
    }, 100);
  });

  // When end-user clicks link in iframe, open it in parent context
  pymParent.onMessage('navigate', function (url) {
    window.open(url, '_blank').focus();
  });

  // wait till images and other iframes are loaded before scrolling the page.
  // or do we want to be more aggressive and scroll when we hit DOM ready?
  document.addEventListener('DOMContentLoaded', function () {
    ready = true;
  });

  // get dimensions of viewport
  const viewport = () => {
    let e = window, a = 'inner';
    if ( !( 'innerWidth' in window ) ){
      a = 'client';
      e = document.documentElement || document.body;
    }
    return {
      width : e[`${a}Width`],
      height : e[`${a}Height`]
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
 */
Talk.render = function (el, opts) {
  if (!el) {
    throw new Error('Please provide Coral.Talk.render() the HTMLElement you want to render Talk in.');
  }
  if (typeof el !== 'object') {
    throw new Error(`Coral.Talk.render() expected HTMLElement but got ${el} (${typeof el})`);
  }
  opts = opts || {};

  // @todo infer this URL without explicit user input (if possible, may have to be added at build/render time of this script)
  if (!opts.talk) {
    throw new Error('Coral.Talk.render() expects opts.talk as the Talk Base URL');
  }

  // ensure el has an id, as pym can't directly accept the HTMLElement
  if (!el.id) {
    el.id = `_${Math.random()}`;
  }

  let asset_url = opts.asset_url;
  if (!asset_url) {
    try {
      asset_url = document.querySelector('link[rel="canonical"]').href;
    } catch (e) {
      console.warn('This page does not include a canonical link tag. Talk has inferred this asset_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages.');
      asset_url = window.location.origin + window.location.pathname;
    }
  }

  let comment = window.location.hash.slice(1);

  let query = {
    title: opts.title,
    asset_url: asset_url,
    id: `${el.id}_iframe`,
    name: `${el.id}_iframe`
  };

  if (opts.asset_id && opts.asset_id.length > 0) {
    query.asset_id = opts.asset_id;
  }

  let pymParent = new pym.Parent(el.id, buildStreamIframeUrl(opts.talk, asset_url, comment), query);

  configurePymParent(pymParent, asset_url);
};

export default Coral;
