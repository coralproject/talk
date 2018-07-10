#!/usr/bin/env ts-node

import program from "commander";
import path from "path";
import watch from "../";

function list(val: string) {
  return val.split(",");
}

program
  .version("0.1.0")
  .usage("<configFile>")
  .option("-o, --only <watcher>", "only run the specified watcher", list)
  .arguments("<configFile>")
  .description("Run watchers defined in <configFile>")
  .action((configFile, cmd) => {
    const { only = [] } = cmd;

    let config: any = require(path.resolve(configFile));
    if (config.__esModule) {
      config = config.default;
    }

    watch(config, { only });
  })
  .parse(process.argv);
