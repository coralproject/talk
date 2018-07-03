#!/usr/bin/env ts-node

import program from "commander";
import fs from "fs";
import path from "path";

const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../.graphqlconfig"), "utf8")
);

program
  .version("0.1.0")
  .usage("<project>")
  .arguments("<project>")
  .description(
    "Returns the schema graph in `.graphqlconfig` based on <project>"
  )
  .action(project => {
    if (!config.projects) {
      // tslint:disable-next-line:no-console
      console.error("Missing projects key in .graphqconfig");
      process.exit(1);
    }
    if (!config.projects[project]) {
      // tslint:disable-next-line:no-console
      console.error(`Project ${project} not found in .graphqconfig`);
      process.exit(1);
    }
    if (!config.projects[project].schemaPath) {
      // tslint:disable-next-line:no-console
      console.error(
        `SchemaPath for project ${project} not found in .graphqconfig`
      );
      process.exit(1);
    }
    // tslint:disable-next-line:no-console
    console.log(config.projects[project].schemaPath);
  })
  .parse(process.argv);
