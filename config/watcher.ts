import path from "path";
import {
  CommandExecutor,
  Config,
  RestartingExecutor,
} from "../scripts/watcher";

const config: Config = {
  rootDir: path.resolve(__dirname, "../src"),
  watchers: {
    compileRelay: {
      paths: [
        "core/client/stream/**/*.ts",
        "core/client/stream/**/*.tsx",
        "core/client/stream/**/*.graphql",
        "core/client/server/**/*.graphql",
      ],
      ignore: ["core/**/*.d.ts"],
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
      executor: new RestartingExecutor("npm run start:development"),
    },
    runWebpackDevServer: {
      paths: [],
      executor: new RestartingExecutor("npm run start:webpackDevServer"),
    },
  },
};

export default config;
