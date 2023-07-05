import { FluentBundle, FluentResource } from "@fluent/bundle/compat";
import fs from "fs";
import path from "path";

import * as functions from "coral-framework/lib/i18n/functions";

// These locale prefixes are always loaded.
const commonPrefixes = ["ui", "common", "framework"];

function decorateErrorWhenMissing(bundle: FluentBundle) {
  const originalHasMessage = bundle.hasMessage;
  const originalGetMessage = bundle.getMessage;
  const missing: string[] = [];
  bundle.hasMessage = (id: string) => {
    const result = originalHasMessage.apply(bundle, [id]);
    if (!result) {
      const msg = `${bundle.locales} translation for key "${id}" not found`;
      // eslint-disable-next-line no-console
      console.error(msg);
      missing.push(id);
    }
    // Even if it is missing, we say it is available and later return a descriptive error
    // string as the translation.
    return true;
  };
  bundle.getMessage = (id: string) => {
    if (missing.includes(id)) {
      return `Missing translation "${id}"`;
    }
    return originalGetMessage.apply(bundle, [id]);
  };
  return bundle;
}

function createFluentBundle(
  target: string,
  pathToLocale: string
): FluentBundle {
  // `useIsolating: false` will remove bidi characters.
  // https://github.com/projectfluent/fluent.js/wiki/Unicode-Isolation
  // We should be able to use `<bdi>` tags instead to support rtl languages.
  const bundle = new FluentBundle("en-US", { functions, useIsolating: false });
  const files = fs.readdirSync(pathToLocale);
  const prefixes = commonPrefixes.concat(target);
  files.forEach((f) => {
    prefixes.forEach((prefix) => {
      if (f.startsWith(prefix)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        bundle.addResource(
          new FluentResource(require(path.resolve(pathToLocale, f)))
        );
      }
    });
  });
  return decorateErrorWhenMissing(bundle);
}

export default createFluentBundle;
