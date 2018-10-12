import "fluent-intl-polyfill/compat";
import { FluentBundle } from "fluent/compat";

import * as functions from "talk-framework/lib/i18n/functions";

import fs from "fs";
import path from "path";

// These locale prefixes are always loaded.
const commonPrefixes = ["common", "framework"];

function decorateErrorWhenMissing(bundle: FluentBundle) {
  const originalHasMessage = bundle.hasMessage;
  const originalGetMessage = bundle.getMessage;
  const missing: string[] = [];
  bundle.hasMessage = (id: string) => {
    const result = originalHasMessage.apply(bundle, [id]);
    if (!result) {
      const msg = `${bundle.locales} translation for key "${id}" not found`;
      // tslint:disable-next-line:no-console
      console.error(msg);
      missing.push(id);
    }
    // Even if it is missing, we say it is available and later return a descriptive error
    // string as the translation.
    return true;
  };
  bundle.getMessage = (id: string) => {
    if (missing.indexOf(id) !== -1) {
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
  const bundle = new FluentBundle("en-US", { functions });
  const files = fs.readdirSync(pathToLocale);
  const prefixes = commonPrefixes.concat(target);
  files.forEach(f => {
    prefixes.forEach(prefix => {
      if (f.startsWith(prefix)) {
        bundle.addMessages(require(path.resolve(pathToLocale, f)));
      }
    });
  });
  return decorateErrorWhenMissing(bundle);
}

export default createFluentBundle;
