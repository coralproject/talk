import { FluentBundle } from "fluent/compat";
import fs from "fs";
import path from "path";

// These locale prefixes are always loaded.
const commonPrefixes = ["common", "framework"];

function createFluentBundle(
  target: string,
  pathToLocale: string
): FluentBundle {
  const bundle = new FluentBundle("en-US");
  const files = fs.readdirSync(pathToLocale);
  const prefixes = commonPrefixes.concat(target);
  files.forEach(f => {
    prefixes.forEach(prefix => {
      if (f.startsWith(prefix)) {
        bundle.addMessages(
          fs.readFileSync(path.resolve(pathToLocale, f)).toString()
        );
      }
    });
  });
  return bundle;
}

export default createFluentBundle;
