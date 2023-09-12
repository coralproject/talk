import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { DateTime } from "luxon";

export default new GraphQLScalarType({
  name: "Time",
  description: "Time represented as an ISO8601 string.",
  serialize(value) {
    if (typeof value === "string") {
      return value;
    }

    return value.toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING: {
        // This handles an empty string.
        if (ast.value && ast.value.length === 0) {
          return null;
        }

        const date = DateTime.fromISO(ast.value, {});
        if (!date.isValid) {
          return null;
        }

        return date.toJSDate();
      }
      default:
        return null;
    }
  },
});
