import path from "path";
import watch, { CommandExecutor, Config } from "./watcher";

const config: Config = [
  {
    path: path.resolve(__dirname, "../src"),
    extensions: ["ts", "tsx"],
    executor: new CommandExecutor("npm", ["run", "compile:relay-stream"]),
  },
  {
    path: path.resolve(__dirname, "../src/core/client/"),
    extensions: ["css"],
    executor: new CommandExecutor("npm", ["run", "compile:css-types"]),
  },
];

watch(config);
