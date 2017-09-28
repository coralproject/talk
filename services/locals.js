const {
  BASE_URL,
  BASE_PATH,
  MOUNT_PATH,
  STATIC_URL,
} = require('../url');

const applyLocals = (locals) => {

  // Apply the BASE_PATH, BASE_URL, and MOUNT_PATH on the app.locals, which will
  // make them available on the templates and the routers.
  locals.BASE_URL = BASE_URL;
  locals.BASE_PATH = BASE_PATH;
  locals.MOUNT_PATH = MOUNT_PATH;
  locals.STATIC_URL = STATIC_URL;
};

module.exports = {
  applyLocals,
};
