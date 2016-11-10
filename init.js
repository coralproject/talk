const Setting = require('./models/setting');

const defaults = {id: '1', moderation: 'pre'};
module.exports = Setting.init(defaults);

// presumably this file will grow, which is why I've broken it out.
