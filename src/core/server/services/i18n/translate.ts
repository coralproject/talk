import { FluentBundle } from "@fluent/bundle/compat";
import { container } from "tsyringe";

import { Config, CONFIG } from "coral-server/config";

/**
 * translate will attempt a translation but fallback to the defaultValue if it
 * can't be translated.
 *
 * @param bundle the bundle to use for translations
 * @param defaultValue the default value if the message or translation isn't
 * available
 * @param id the ID for the translation
 * @param args the args to be used in the translation
 * @param errors the errors to for the translation bundle
 */
export function translate(
  bundle: FluentBundle,
  defaultValue: string,
  id: string,
  args?: object,
  errors?: Error[]
): string {
  const config = container.resolve<Config>(CONFIG);

  const message = bundle.getMessage(id);
  if (!message || !message.value) {
    if (config.get("env") === "test") {
      throw new Error(`the message for ${id} is missing`);
    }

    return defaultValue;
  }

  const value = bundle.formatPattern(message.value, args, errors);
  if (!value) {
    return defaultValue;
  }

  return value;
}
