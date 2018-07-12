// Allow importing typescript files.
require("ts-node/register");

const kebabCase = require("lodash/kebabCase");
const mapKeys = require("lodash/mapKeys");
const mapValues = require("lodash/mapValues");
const pickBy = require("lodash/pickBy");
const flat = require("flat");
const paths = require("./paths");
const autoprefixer = require("autoprefixer");
const postcssFontMagician = require("postcss-font-magician");
const postcssFlexbugsFixes = require("postcss-flexbugs-fixes");
const postcssVariables = require("postcss-css-variables");
const postcssPresetEnv = require("postcss-preset-env");
const postcssNested = require("postcss-nested");
const postcssImport = require("postcss-import");
const postcssPrependImports = require("postcss-prepend-imports");
const postcssAdvancedVariables = require("postcss-advanced-variables");

delete require.cache[paths.appThemeVariables];
const variables = require(paths.appThemeVariables).default;
const flatKebabVariables = mapKeys(
  mapValues(flat(variables, { delimiter: "-" }), v => v.toString()),
  (_, k) => kebabCase(k)
);

// These are the default css standard variables.
const cssVariables = pickBy(
  flatKebabVariables,
  (v, k) => !k.startsWith("breakpoints-")
);

// These are sass style variables used in media queries.
const mediaQueryVariables = mapValues(
  pickBy(flatKebabVariables, (v, k) => k.startsWith("breakpoints-")),
  v => `${v}px`
);

module.exports = {
  // Necessary for external CSS imports to work
  // https://github.com/facebookincubator/create-react-app/issues/2677
  ident: "postcss",
  plugins: [
    postcssPrependImports({
      path: "",
      files: [paths.appThemeGlobalCSS],
    }),
    postcssImport(),
    postcssNested(),
    // Sass style variables to be used in media queries.
    postcssAdvancedVariables({ variables: mediaQueryVariables }),
    // CSS standard variables for everything else.
    postcssVariables({ variables: cssVariables }),
    postcssPresetEnv(),
    postcssFontMagician(),
    postcssFlexbugsFixes,
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
