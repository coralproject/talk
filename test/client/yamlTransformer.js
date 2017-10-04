const yaml = require('yamljs');

module.exports = {
  process(src) {
    const data = yaml.parse(src);
    return `module.exports = ${JSON.stringify(data)};`;
  },
};
