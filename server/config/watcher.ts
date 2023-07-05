import path from "path";

import {
  CommandExecutor,
  Config,
  LongRunningExecutor,
} from "../scripts/watcher";

const config: Config = {
  rootDir: path.resolve(__dirname, "../src"),
  watchers: {
    generateSchemaTypes: {
      paths: ["core/server/**/*.graphql"],
      executor: new CommandExecutor("npx gulp server:schema", {
        runOnInit: true,
      }),
    },
    generateRelayStream: {
      paths: [
        "core/client/stream/**/*.ts",
        "core/client/stream/**/*.tsx",
        "core/client/stream/**/*.graphql",
        "core/server/**/*.graphql",
      ],
      ignore: [
        "core/**/*.d.ts",
        "core/**/*.graphql.ts",
        "**/test/**/*",
        "core/**/*.spec.*",
      ],
      executor: new CommandExecutor("npm run --silent generate:relay:stream", {
        runOnInit: true,
      }),
    },
    generateRelayAccount: {
      paths: [
        "core/client/account/**/*.ts",
        "core/client/account/**/*.tsx",
        "core/client/account/**/*.graphql",
        "core/server/**/*.graphql",
      ],
      ignore: [
        "core/**/*.d.ts",
        "core/**/*.graphql.ts",
        "**/test/**/*",
        "core/**/*.spec.*",
      ],
      executor: new CommandExecutor("npm run generate:relay:account", {
        runOnInit: true,
      }),
    },
    generateRelayAdmin: {
      paths: [
        "core/client/admin/**/*.ts",
        "core/client/admin/**/*.tsx",
        "core/client/admin/**/*.graphql",
        "core/server/**/*.graphql",
      ],
      ignore: [
        "core/**/*.d.ts",
        "core/**/*.graphql.ts",
        "**/test/**/*",
        "core/**/*.spec.*",
      ],
      executor: new CommandExecutor("npm run --silent generate:relay:admin", {
        runOnInit: true,
      }),
    },
    generateRelayAuth: {
      paths: [
        "core/client/auth/**/*.ts",
        "core/client/auth/**/*.tsx",
        "core/client/auth/**/*.graphql",
        "core/server/**/*.graphql",
      ],
      ignore: [
        "core/**/*.d.ts",
        "core/**/*.graphql.ts",
        "**/test/**/*",
        "core/**/*.spec.*",
      ],
      executor: new CommandExecutor("npm run --silent generate:relay:auth", {
        runOnInit: true,
      }),
    },
    generateRelayInstall: {
      paths: [
        "core/client/install/**/*.ts",
        "core/client/install/**/*.tsx",
        "core/client/install/**/*.graphql",
        "core/server/**/*.graphql",
      ],
      ignore: [
        "core/**/*.d.ts",
        "core/**/*.graphql.ts",
        "**/test/**/*",
        "core/**/*.spec.*",
      ],
      executor: new CommandExecutor("npm run --silent generate:relay:install", {
        runOnInit: true,
      }),
    },
    generateCSSTypes: {
      paths: ["**/*.css"],
      executor: new CommandExecutor("npm run --silent generate:css-types", {
        runOnInit: true,
      }),
    },
    runServer: {
      paths: ["core/server/locales/**/*.ftl"],
      ignore: ["core/client/**/*"],
      executor: new LongRunningExecutor("npm run --silent start:development"),
    },
    runServerWithWebpackDevServerSupport: {
      paths: ["core/server/locales/**/*.ftl"],
      ignore: ["core/client/**/*"],
      executor: new LongRunningExecutor(
        "WEBPACK_DEV_SERVER=true npm run --silent start:development"
      ),
    },
    runServerLint: {
      paths: ["core/**/*.ts"],
      ignore: ["core/client/**/*"],
      executor: new LongRunningExecutor("npm run --silent lint:server"),
    },
    runServerSyntaxCheck: {
      paths: ["core/**/*.ts"],
      ignore: ["core/client/**/*"],
      executor: new LongRunningExecutor("npm run --silent tscheck:server"),
    },
    runWebpackDevServer: {
      paths: [],
      executor: new LongRunningExecutor(
        "npm run --silent start:webpackDevServer"
      ),
    },
    runDocz: {
      paths: [],
      executor: new LongRunningExecutor("npm run --silent docz -- dev"),
    },
  },
  defaultSet: "client",
  sets: {
    server: [
      "generateSchemaTypes",
      "runServer",
      "runServerLint",
      "runServerSyntaxCheck",
    ],
    client: [
      "runServerWithWebpackDevServerSupport",
      "runServerLint",
      "runServerSyntaxCheck",
      "runWebpackDevServer",
      "generateCSSTypes",
      "generateRelayStream",
      "generateRelayAuth",
      "generateRelayInstall",
      "generateRelayAccount",
      "generateRelayAdmin",
      "generateSchemaTypes",
    ],
    docz: ["runDocz", "generate"],
    generate: [
      "generateSchemaTypes",
      "generateCSSTypes",
      "generateRelayStream",
      "generateRelayAuth",
      "generateRelayInstall",
    ],
  },
};

export default config;
