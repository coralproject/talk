const path = require('path');
const fs = require('fs');
const { get, set, template } = require('lodash');

// load all the templates as strings
const templates = {
  cache: {},
  registered: {},
};

// Registers a template with the given filename and format.
templates.register = (filename, name, format) => {
  // Check to see if this template was already registered.
  if (get(templates.registered, [name, format], null) !== null) {
    return;
  }

  const file = fs.readFileSync(filename, 'utf8');
  const view = template(file);

  set(templates.registered, [name, format], view);
};

// load the templates per request during development
templates.render = (name, format = 'txt', context) => {
  // Check to see if the template is a registered template (provided by a plugin
  // ) and prefer that first.
  let view = get(templates.registered, [name, format], null);
  if (view !== null) {
    return view(context);
  }

  if (process.env.NODE_ENV === 'production') {
    // If we are in production mode, check the view cache.
    const view = get(templates.cache, [name, format], null);
    if (view !== null) {
      return view(context);
    }
  }

  // Template was not registered and was not cached. Let's try and find it!
  const filename = path.join(
    __dirname,
    'templates',
    [name, format, 'ejs'].join('.')
  );
  const file = fs.readFileSync(filename, 'utf8');
  view = template(file);

  if (process.env.NODE_ENV === 'production') {
    // If we are in production mode, fill the view cache.
    set(templates.cache, [name, format], view);
  }

  return view(context);
};

module.exports = templates;
