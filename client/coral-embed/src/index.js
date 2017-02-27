import pym from 'pym.js';

// This function should return value of window.Coral
const Coral = {};
const Talk = Coral.Talk = {};

// build the URL to load in the pym iframe
function buildStreamIframeUrl(talkBaseUrl, asset) {
  let iframeUrl = [
    talkBaseUrl,
    (talkBaseUrl.match(/\/$/) ? '' : '/'), // make sure no double-'/' if opts.talk already ends with '/'
    'embed/stream?asset_url=',
    encodeURIComponent(asset)
  ].join('');
  return iframeUrl;
}

// Set up postMessage listeners/handlers on the pymParent
// e.g. to resize the iframe, and navigate the host page
function configurePymParent(pymParent, assetUrl) {
  let notificationOffset = 200;
  let ready = false;

  // Resize parent iframe height when child height changes
  pymParent.onMessage('height', function(height) {

    // TODO: In local testing, this is firing nonstop. Maybe there's a bug on the inside?
    // Or it's by design of pym... but that's very wasteful of CPU and DOM reflows (jank)
    pymParent.el.querySelector('iframe').height = `${height  }px`;
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
        pymParent.sendMessage('DOMContentLoaded', assetUrl);
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
 * @param {String} [opts.asset] - parent Asset ID or URL. Comments in the
 * stream will replies to this asset
 */
Talk.render = function (el, opts) {
  if ( ! el) {
    throw new Error('Please provide Coral.Talk.render() the HTMLElement you want to render Talk in.');
  }
  if (typeof el !== 'object') {
    throw new Error(`Coral.Talk.render() expected HTMLElement but got ${el} (${typeof el})`);
  }
  opts = opts || {};

  // @todo infer this URL without explicit user input (if possible, may have to be added at build/render time of this script)
  if (! opts.talk) {
    throw new Error('Coral.Talk.render() expects opts.talk as the Talk Base URL');
  }

  // ensure el has an id, as pym can't directly accept the HTMLElement
  if (!el.id) {
    el.id = `_${Math.random()}`;
  }

  let asset = opts.asset || window.location;
  let pymParent = new pym.Parent(el.id, buildStreamIframeUrl(opts.talk, asset), {
    title: opts.title,
    asset_url: asset,
    id: `${el.id}_iframe`,
    name: `${el.id}_iframe`
  });

  configurePymParent(pymParent, asset);
};

export default Coral;
