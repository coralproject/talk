import path from "path";
import {
  CommandExecutor,
  Config,
  LongRunningExecutor,
} from "../scripts/watcher";

const config: Config = {
  rootDir: path.resolve(__dirname, "../src"),
  watchers: {
    compileSchema: {
      paths: ["core/server/**/*.graphql"],
      executor: new CommandExecutor("npx gulp server:schema", {
        runOnInit: true,
      }),
    },
    compileRelayStream: {
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
      executor: new CommandExecutor("npm run compile:relay-stream", {
        runOnInit: true,
      }),
    },
    compileCSSTypes: {
      paths: ["**/*.css"],
      executor: new CommandExecutor("npm run compile:css-types", {
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
    server: ["compileSchema", "runServer"],
    client: [
      "runServer",
      "runWebpackDevServer",
      "compileCSSTypes",
      "compileRelayStream",
    ],
    docz: ["runDocz", "compileCSSTypes"],
    compile: ["compileSchema", "compileCSSTypes", "compileRelayStream"],
  },
};

export default config;
