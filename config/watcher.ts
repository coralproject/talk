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
      executor: new CommandExecutor("npm run generate:relay-stream", {
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
      executor: new CommandExecutor("npm run generate:relay-account", {
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
      executor: new CommandExecutor("npm run generate:relay-admin", {
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
      executor: new CommandExecutor("npm run generate:relay-auth", {
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
      executor: new CommandExecutor("npm run generate:relay-install", {
        runOnInit: true,
      }),
    },
    generateCSSTypes: {
      paths: ["**/*.css"],
      executor: new CommandExecutor("npm run generate:css-types", {
        runOnInit: true,
      }),
    },
    runServer: {
      paths: ["core/**/*.ts", "core/locales/**/*.ftl"],
      ignore: ["core/client/**/*"],
      executor: new LongRunningExecutor("npm run start:development"),
    },
    runWebpackDevServer: {
      paths: [],
      executor: new LongRunningExecutor("npm run start:webpackDevServer"),
    },
    runDocz: {
      paths: [],
      executor: new LongRunningExecutor("npm run docz -- dev"),
    },
  },
  defaultSet: "client",
  sets: {
    server: ["generateSchemaTypes", "runServer"],
    client: [
      "runServer",
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
