import "fluent-intl-polyfill/compat";
import { FluentBundle } from "fluent/compat";

import * as functions from "./functions";
import { LocalesData } from "./locales";

// Don't warn in production.
let decorateWarnMissing = (bundle: FluentBundle) => bundle;

// Warn about missing locales if we are not in production.
if (process.env.NODE_ENV !== "production") {
  decorateWarnMissing = (() => {
    const warnings: string[] = [];
    return (bundle: FluentBundle) => {
      const original = bundle.hasMessage;
      bundle.hasMessage = (id: string) => {
        const result = original.apply(bundle, [id]);
        if (!result) {
          const warn = `${
            bundle.locales
          } translation for key "${id}" not found`;
          if (!warnings.includes(warn)) {
            // tslint:disable:next-line: no-console
            console.warn(warn);
            warnings.push(warn);
          }
        }
        return result;
      };
      return bundle;
    };
  })();
}

/**
 * Given a locales array and the `data` from the `locales-loader`,
 * generateMessages returns an Array of MessageContext as a Promise.
 * This array is meant to be consumed by `react-fluent`.
 *
 * Use it in conjunction with `negotiateLanguages`.
 */
export default async function generateBundles(
  locales: ReadonlyArray<string>,
  data: LocalesData
): Promise<FluentBundle[]> {
  const promises = [];

  for (const locale of locales) {
    const bundle = new FluentBundle(locale, { functions });
    if (locale in data.bundled) {
      bundle.addMessages(data.bundled[locale]);
      promises.push(decorateWarnMissing(bundle));
    } else if (locale in data.loadables) {
      const content = await data.loadables[locale]();
      bundle.addMessages(content);
      promises.push(decorateWarnMissing(bundle));
    } else {
      throw Error(`Locale ${locale} not available`);
    }
  }

  return await Promise.all(promises);
}
