
/**
 * Just load the root config file and throw an
 * error message if not present
 */

try {
  module.exports = require('../../config.json')
} catch (error) {
  const message = `The config.json file under the root directory is missing
or invalid Please add one to use this app. You can use config.sample.json as a guide.`
  window.alert(message)
  throw new Error(message)
}
