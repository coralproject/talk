import { FluentBundle, FluentResource } from "@fluent/bundle/compat";

import { globalErrorReporter } from "../errors";
import * as functions from "./functions";
import { LocalesData } from "./locales";

const decorateWarnMissing = (() => {
  const warnings: string[] = [];
  return (bundle: FluentBundle) => {
    const original = bundle.hasMessage;
    bundle.hasMessage = (id: string) => {
      const result = original.apply(bundle, [id]);
      if (!result) {
        const warn = `${bundle.locales} translation for key "${id}" not found`;
        if (!warnings.includes(warn)) {
          if (bundle.locales.includes("en-US")) {
            // Report missing english translations!
            globalErrorReporter.report(
              `Missing English translation for "${id}"`
            );
          } else if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.warn(warn);
          }
          warnings.push(warn);
        }
      }
      return result;
    };
    return bundle;
  };
})();

/**
 * Given a locales array and the `data` from the `locales-loader`,
 * generateMessages returns an Array of MessageContext as a Promise.
 * This array is meant to be consumed by `react-fluent`.
 */
export default async function generateBundles(
  locales: ReadonlyArray<string>,
  data: LocalesData
): Promise<FluentBundle[]> {
  const promises = [];

  for (const locale of locales) {
    // `useIsolating: false` will remove bidi characters.
    // https://github.com/projectfluent/fluent.js/wiki/Unicode-Isolation
    // We should be able to use `<bdi>` tags instead to support rtl languages.
    const bundle = new FluentBundle(locale, { functions, useIsolating: false });
    if (locale in data.bundled) {
      bundle.addResource(new FluentResource(data.bundled[locale]));
      promises.push(decorateWarnMissing(bundle));
    } else if (locale in data.loadables) {
      const content = await data.loadables[locale]();
      bundle.addResource(new FluentResource(content));
      promises.push(decorateWarnMissing(bundle));
    } else {
      globalErrorReporter.report(new Error(`Locale ${locale} not available`));
    }
  }

  return await Promise.all(promises);
}
