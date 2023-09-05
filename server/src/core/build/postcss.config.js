require("ts-node/register");

const kebabCase = require("lodash/kebabCase");
const mapKeys = require("lodash/mapKeys");
const mapValues = require("lodash/mapValues");
const flat = require("flat");
const paths = require("./paths").default;
const autoprefixer = require("autoprefixer");
const postcssFlexbugsFixes = require("postcss-flexbugs-fixes");
const postcssPresetEnv = require("postcss-preset-env");
const postcssNested = require("postcss-nested");
const postcssImport = require("postcss-import");
const postcssMixins = require("postcss-mixins");
const postcssPrependImports = require("postcss-prepend-imports");
const postcssAdvancedVariables = require("postcss-advanced-variables");

delete require.cache[paths.appSassLikeVariables];
const sassLikeVariables = require(paths.appSassLikeVariables).default;

const kebabs = mapKeys(
  mapValues(flat(sassLikeVariables, { delimiter: "-" }), (v) => v.toString()),
  (_, k) => kebabCase(k)
);

// Generate sass-style variables to inject into css
const postCssVariables = mapValues(kebabs, (value, key) => {
  // Add unit to breakpoints.
  // Add 1 to support mobile first approach where we start
  // with the smallest screen and gradually add styling for the
  // next bigger screen. This is realized using `min-width` without
  // ever using `max-width`.
  if (key.toString().startsWith("breakpoints-")) {
    return `${Number.parseInt(value, 10) + 1}px`;
  }

  // Default return the raw value
  return value;
});

module.exports = {
  // Necessary for external CSS imports to work
  // https://github.com/facebookincubator/create-react-app/issues/2677
  ident: "postcss",
  plugins: [
    // This allows us to define dynamic css variables.
    postcssPrependImports({
      path: "",
      files: [paths.appThemeMixinsCSS],
    }),
    // Needed by above plugin.
    postcssImport(),
    // Support mixins.
    postcssMixins(),
    // Support nesting.
    postcssNested(),
    // Sass style variables to be used in media queries.
    postcssAdvancedVariables({ variables: postCssVariables }),
    // Provides a modern CSS environment.
    postcssPresetEnv(),
    // Fix known flexbox bugs.
    postcssFlexbugsFixes,
    // Vendor prefixing.
    autoprefixer({
      flexbox: "no-2009",
    }),
  ],
};
