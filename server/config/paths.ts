import fs from "fs";
import path from "path";
import appPaths from "../src/core/build/paths";

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

// config after eject: we're in ./config/
export default {
  ...appPaths,
  appJestConfig: resolveApp("config/jest.config.js"),
};
