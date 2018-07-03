import path from "path";
import {
  CommandExecutor,
  Config,
  LongRunningExecutor,
} from "../scripts/watcher";

const config: Config = {
  rootDir: path.resolve(__dirname, "../src"),
  watchers: {
    compileGraphQLTypes: {
      paths: ["core/server/graph/**/*.graphql"],
      executor: new CommandExecutor("npm run compile:graphql", {
        runOnInit: true,
      }),
    },
    compileRelayStream: {
      paths: [
        "core/client/stream/**/*.ts",
        "core/client/stream/**/*.tsx",
        "core/client/stream/**/*.graphql",
        "core/client/server/**/*.graphql",
      ],
      ignore: ["core/**/*.d.ts", "core/**/*.graphql.ts"],
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
  },
};

export default config;
