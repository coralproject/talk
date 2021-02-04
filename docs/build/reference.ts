#!/usr/bin/env ts-node

import dotenv from "dotenv";
import fs from "fs";
import _ from "lodash";
import path from "path";

import reference from "../data/__generated__/introspection.json";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
dotenv.config();

interface SidebarEntry {
  title: string;
  url: string;
}

interface SidebarEntryGroup {
  title: string;
  url: string;
  items: SidebarEntry[];
}

function generateSidebar() {
  // Group all the types by their kind.
  const grouped = _.groupBy(reference.__schema.types, "kind");
  const groups = Object.entries(grouped).sort(([left], [right]) =>
    left.localeCompare(right)
  );

  const excluded: Record<string, string[]> = {
    OBJECT: ["Query", "Mutation", "Subscription"],
  };

  // For each of the groups within the grouped object, create an entry group.
  const entries: Array<SidebarEntry | SidebarEntryGroup> = [];

  // Push in the excluded types that are reserved.
  for (const name of excluded.OBJECT) {
    entries.push({
      title: name,
      url: `/reference/object/${name}`,
    });
  }

  for (const [kind, types] of groups) {
    entries.push({
      title: _.startCase(kind.toLowerCase()),
      url: `/reference/${kind.toLowerCase()}`,
      items: types
        // filter will remove all the types that start with a `__`, which are internal
        // GraphQL types.
        .filter(
          (type) =>
            !type.name.startsWith("__") &&
            (!excluded[kind] || !excluded[kind].includes(type.name))
        )
        // sort will sort the types by name.
        .sort((left, right) => left.name.localeCompare(right.name))
        // map will translate the type into a sidebar entry.
        .map((type) => ({
          title: type.name,
          url: `/reference/${kind.toLowerCase()}/${type.name}`,
        })),
    });
  }

  // Write out the sidebar JSON to the generated folder.
  fs.writeFileSync(
    path.resolve(__dirname, "..", "data", "__generated__", "sidebar.json"),
    JSON.stringify(entries),
    "utf8"
  );

  // eslint-disable-next-line no-console
  console.log("Wrote docs/data/__generated__/sidebar.json");
}

generateSidebar();
