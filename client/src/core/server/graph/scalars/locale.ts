import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import { LOCALES } from "coral-common/helpers/i18n";

function assertSupportLocale(locale: string) {
  if (!LOCALES.includes(locale as any)) {
    throw new Error(`Supported locales are ${JSON.stringify(LOCALES)}`);
  }
}

export default new GraphQLScalarType({
  name: "Locale",
  description: "Locale represents a language code in the BCP 47 format.",
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (typeof value !== "string") {
      throw new Error("Locale must be a string in BCP 47 format.");
    }
    assertSupportLocale(value);
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new Error("Locale must be a string in BCP 47 format.");
    }
    const value = ast.value.toString();
    assertSupportLocale(value);
    return value;
  },
});
