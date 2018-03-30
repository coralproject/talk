const config = {
  // Highlight Links
  highlightLinks: true,

  // Linkify Settings
  linkify: {
    className: 'talk-plugin-rich-text-link',
    tagName: 'a',
    target: {
      url: '_blank',
    },
  },

  // TODO: move to admin eventually
  // Super strict rules to make sure users only submit the tags they are allowed
  dompurify: {
    ALLOWED_TAGS: ['b', 'i', 'blockquote', 'br', 'div', 'span'],
    ALLOWED_ATTR: [],
  },

  // Secure config for jsdom even when DOMPurify creates a document without a browsing context
  jsdom: {
    features: {
      FetchExternalResources: false, // disables resource loading over HTTP / filesystem
      ProcessExternalResources: false, // do not execute JS within script blocks
    },
  },
};

module.exports = config;
