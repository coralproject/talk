#!/usr/bin/env ts-node

import dotenv from "dotenv";
import fs from "fs-extra";
import _ from "lodash";
import nunjucks from "nunjucks";
import path from "path";

import introspection from "../../__generated__/introspection.json";

import { Nav } from "../../layouts/SidebarLayout";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

// Apply all the configuration provided in the .env file if it isn't already in
// the environment.
dotenv.config();

const destination = path.resolve(
  __dirname,
  "..",
  "..",
  "__generated__",
  "reference"
);

function writeOutput(fileName: string, output: string): void {
  const filePath = path.resolve(destination, fileName);

  const dirName = path.dirname(filePath);
  if (!fs.existsSync(dirName)) {
    fs.ensureDirSync(dirName);
  }

  // Write out the sidebar JSON to the generated folder.
  fs.writeFileSync(filePath, output, "utf8");

  // eslint-disable-next-line no-console
  console.log(`Wrote ${filePath.replace(process.cwd(), "")}`);
}

function generateSidebar() {
  // Group all the types by their kind.
  const grouped = _.groupBy(introspection.__schema.types, "kind");
  const groups = Object.entries(grouped).sort(([left], [right]) =>
    left.localeCompare(right)
  );

  const excluded: Record<string, string[]> = {
    OBJECT: [
      introspection.__schema.queryType.name,
      introspection.__schema.mutationType.name,
      introspection.__schema.subscriptionType.name,
    ],
  };

  // For each of the groups within the grouped object, create an entry group.
  const entries: Nav[0]["items"] = [];

  // Push in the excluded types that are reserved.
  for (const name of excluded.OBJECT) {
    entries.push({
      title: name,
      href: `/reference/object/${name}`,
    });
  }

  for (const [kind, types] of groups) {
    entries.push({
      title: _.startCase(kind.toLowerCase()),
      href: `/reference/${kind.toLowerCase()}`,
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
          href: `/reference/${kind.toLowerCase()}/${type.name}`,
        })),
    });
  }

  writeOutput("sidebar.json", JSON.stringify(entries, null, 2));
}

/**
 * This type represents the structure that the Nunjucks template expects.
 * Changes to this interface will require an update to the associated
 * `template.njs` file.
 */
interface GraphQLType {
  kind: string;
  name: string;
  description?: string | null;
  fields: Array<{
    name: string;
    description?: string | null;
    type: {
      name: string;
    };
  }>;
}

const template = nunjucks.compile(
  fs.readFileSync(path.resolve(__dirname, "template.njs"), "utf8")
);

function writeGraphQLType(type: GraphQLType) {
  writeOutput(
    path.join("content", type.kind.toLowerCase(), `${type.name}.mdx`),
    template.render(type)
  );
}

function generateContent() {
  for (const t of introspection.__schema.types) {
    if (t.name.startsWith("__")) {
      continue;
    }

    // Transform the type to conform to the expected.

    const type: GraphQLType = {
      kind: t.kind,
      name: t.name,
      description: t.description,
      fields: [],
    };

    if (t.fields) {
      for (const field of t.fields) {
        type.fields.push({
          name: field.name,
          description: field.description,
          type: {
            name: field.type.name || "",
          },
        });
      }
    }

    writeGraphQLType(type);
  }
}

generateSidebar();
generateContent();
