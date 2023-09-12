const typescriptEslintRecommended =
  require("@typescript-eslint/eslint-plugin/dist/configs/eslint-recommended")
    .overrides[0];
const typescriptRecommended = require("@typescript-eslint/eslint-plugin/dist/configs/recommended.js");
const typescriptRecommendedTypeChecking = require("@typescript-eslint/eslint-plugin/dist/configs/recommended-requiring-type-checking.js");
const typescriptEslintPrettier = require("eslint-config-prettier/@typescript-eslint");
const react = require("eslint-plugin-react").configs.recommended;
const jsxA11y = require("eslint-plugin-jsx-a11y").configs.recommended;
const reactPrettier = require("eslint-config-prettier/react");

const typescriptOverrides = {
  files: ["*.ts", "*.tsx"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    "@typescript-eslint",
    "@typescript-eslint/tslint",
    "react",
    "jsx-a11y",
    "react-hooks",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: Object.assign(
    typescriptEslintRecommended.rules,
    typescriptRecommended.rules,
    typescriptEslintPrettier.rules,
    react.rules,
    jsxA11y.rules,
    reactPrettier.rules,
    {
      // TODO: (cvle) make this an error
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/adjacent-overload-signatures": "error",
      // TODO: (cvle) change `readonly` param to `array-simple` when upgraded typescript.
      "@typescript-eslint/array-type": [
        "error",
        { default: "array-simple", readonly: "generic" },
      ],
      "@typescript-eslint/ban-types": [
        "error",
        {
          types: {
            "{}": false,
            object: false,
            extendDefaults: true,
          },
        },
      ],
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          overrides: {
            constructors: "off",
          },
        },
      ],
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { args: "none", ignoreRestSiblings: true },
      ],
      "@typescript-eslint/no-use-before-define": "off", // TODO: (cvle) Should be on?
      "@typescript-eslint/no-use-before-declare": "off",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/triple-slash-reference": "error",
      "@typescript-eslint/type-annotation-spacing": "off",
      "@typescript-eslint/unified-signatures": "error",
      // (cvle) disabled, because the way we use labels in our code cause to many
      // false positives.
      "jsx-a11y/label-has-associated-control": "off",
      "react/display-name": "error",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "no-empty-function": "off",
      // (tessalt) disabled because video elements are only used to display gifs, which have no audio
      "jsx-a11y/media-has-caption": "off",
    }
  ),
};

const jestTypeCheckingOverrides = {
  files: ["test/**/*.ts", "test/**/*.tsx"],
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
  },
};

const typescriptTypeCheckingOverrides = {
  files: ["*.ts", "*.tsx"],
  parserOptions: {
    project: ["./tsconfig.json", "./src/tsconfig.json"],
    // TODO: (cvle) this is a workaround, see: https://github.com/typescript-eslint/typescript-eslint/issues/1091.
    createDefaultProgram: true,
  },
  rules: Object.assign(typescriptRecommendedTypeChecking.rules, {
    "@typescript-eslint/tslint/config": [
      "error",
      {
        rules: {
          "ordered-imports": {
            options: {
              // Legacy sorting until this is fixed: https://github.com/SoominHan/import-sorter/issues/60
              "import-sources-order": "case-insensitive-legacy",
              "module-source-path": "full",
              "named-imports-order": "case-insensitive-legacy",
            },
          },
        },
      },
    ],
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    // 28.11.19: (cvle) Disabled because behavior of regexp.exec seems different than str.match?
    "@typescript-eslint/prefer-regexp-exec": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/unbound-method": "off", // 10.10.19: (cvle) seems to give false positive.
  }),
  overrides: [jestTypeCheckingOverrides],
};

const jestOverrides = {
  env: {
    jest: true,
  },
  files: ["test/**/*.ts", "test/**/*.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
  globals: {
    expectAndFail: "readonly",
    fail: "readonly",
  },
  rules: {
    "no-restricted-globals": "off",
  },
};

// Setup the overrides.
const overrides = [jestOverrides, typescriptOverrides];
// Skip type information to make it faster!
if (process.env.FAST_LINT !== "true") {
  overrides.push(typescriptTypeCheckingOverrides);
}

module.exports = {
  overrides,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jsdoc/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "arrow-body-style": "off",
    "arrow-parens": ["off", "as-needed"],
    camelcase: "off",
    complexity: "off",
    "constructor-super": "error",
    "spaced-comment": ["error", "always"],
    curly: "error",
    "dot-notation": "error",
    "eol-last": "off",
    eqeqeq: "error",
    "guard-for-in": "error",
    "jsdoc/check-param-names": "off",
    "jsdoc/require-jsdoc": "off",
    "jsdoc/require-returns": "off",
    "jsdoc/require-param": "off",
    "jsdoc/require-param-type": "off",
    "jsdoc/require-returns-type": "off",
    "linebreak-style": "off",
    "max-classes-per-file": ["error", 1],
    "member-ordering": "off",
    "new-parens": "off",
    "newline-per-chained-call": "off",
    "no-bitwise": "error",
    "no-caller": "error",
    "no-cond-assign": "error",
    "no-console": "error",
    "no-debugger": "error",
    "no-empty": "error",
    "no-eval": "error",
    "no-extra-semi": "off",
    "no-fallthrough": "error",
    "no-invalid-this": "off",
    "no-irregular-whitespace": "off",
    "no-multiple-empty-lines": "off",
    "no-new-wrappers": "error",
    "no-restricted-globals": [
      "error",
      {
        name: "window",
        message:
          "Get it from 'CoralContext' if possible. Otherwise ignore and make sure using 'window' globally will work in all environments: 'SSR', 'Testing', and 'Browser'",
      },
      {
        name: "document",
        message: "Replace with `window.document`",
      },
      {
        name: "localStorage",
        message: "Replace with `window.localStorage`",
      },
      {
        name: "sessionStorage",
        message: "Replace with `window.sessionStorage`",
      },
      {
        name: "confirm",
        message: "Replace with `window.confirm`",
      },
    ],
    "no-prototype-builtins": "error",
    "no-shadow": "error",
    "no-throw-literal": "error",
    "no-undef": "off",
    "no-undef-init": "error",
    "no-unsafe-finally": "error",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    "no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
    "no-var": "error",
    "object-shorthand": "error",
    "one-var": "off",
    "prefer-arrow-callback": "off",
    "prefer-const": "error",
    "quote-props": "off",
    radix: "error",
    "require-atomic-updates": "off",
    "space-before-function-paren": "off",
    "sort-imports": "off",
    "use-isnan": "error",
    "valid-typeof": "off",
  },
};
