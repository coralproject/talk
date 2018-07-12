// Allow importing typescript files.
require("ts-node/register");

const precss = require("precss");
const autoprefixer = require("autoprefixer");
const fontMagician = require("postcss-font-magician");
const kebabCase = require("lodash/kebabCase");
const mapKeys = require("lodash/mapKeys");
const flat = require("flat");
const flexbugsFixes = require("postcss-flexbugs-fixes");
const paths = require("./paths");

delete require.cache[paths.appThemeVariables];
const variables = require(paths.appThemeVariables).default;
const flatKebabVariables = mapKeys(
  flat(variables, { delimiter: "-" }),
  (_, k) => kebabCase(k)
);

module.exports = {
  // Necessary for external CSS imports to work
  // https://github.com/facebookincubator/create-react-app/issues/2677
  ident: "postcss",
  plugins: [
    precss({ variables: flatKebabVariables }),
    fontMagician(),
    flexbugsFixes,
    autoprefixer({
      browsers: [
        ">1%",
        "last 4 versions",
        "Firefox ESR",
        "not ie < 9", // React doesn't support IE8 anyway
      ],
      flexbox: "no-2009",
    }),
  ],
};
