const config = {
  // Super strict rules to make sure users only submit the tags they are allowed
  dompurify: { ALLOWED_TAGS: ['b', 'i', 'blockquote'] },
};

module.exports = config;
