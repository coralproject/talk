const hjson = require('hjson');
module.exports = hjson.parse(process.env.TALK_PLUGINS_JSON);
