#!/usr/bin/env ts-node

import program from "commander";
import path from "path";
import watch from "../";

async function run(
  args: ReadonlyArray<string>,
  options: Record<string, string>
) {
  const only = args;
  const { config: configFile = "" } = options;
  if (!configFile) {
    throw new Error("Config file not specified");
  }

  // tslint:disable-next-line:no-var-requires
  let config: any = require(path.resolve(configFile));
  if (config.__esModule) {
    config = config.default;
  }

  try {
    await watch(config, { only });
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
    process.exit(1);
  }
}

const cmd = program
  .version("0.1.0")
  .usage("[watchers or sets]")
  .option("-c, --config <configFile>", "Use given config file")
  .description("Run watchers defined in <configFile>")
  .parse(process.argv);

run(cmd.args, cmd.opts());
