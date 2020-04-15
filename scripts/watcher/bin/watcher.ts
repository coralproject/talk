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

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let config: any = require(path.resolve(configFile));
  if (config.__esModule) {
    config = config.default;
  }

  await watch(config, { only });
}

const cmd = program
  .version("0.1.0")
  .usage("[watchers or sets]")
  .option("-c, --config <configFile>", "Use given config file")
  .description("Run watchers defined in <configFile>")
  .parse(process.argv);

run(cmd.args, cmd.opts()).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
