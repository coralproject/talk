const smartImport = require('postcss-smart-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const variables = require('client/coral-ui-kit/theme/variables');
const fontMagician = require('postcss-font-magician');

module.exports = {
  plugins: [
    smartImport,
    precss({ variables: { variables } }),
    fontMagician(),
    autoprefixer,
  ],
};
