#!/usr/bin/env ts-node

import program from "commander";
import path from "path";
import watch from "../";

program
  .version("0.1.0")
  .usage("<configFile>")
  .arguments("<configFile>")
  .description("Run watchers defined in <configFile>")
  .action(configFile => {
    let config: any = require(path.resolve(configFile));
    if (config.__esModule) {
      config = config.default;
    }
    watch(config);
  })
  .parse(process.argv);
