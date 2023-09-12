import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { DateTime } from "luxon";

import { Cursor } from "coral-server/models/helpers";

function parseIntegerCursor(value: string): number | null {
  try {
    const cursor = parseInt(value, 10);
    if (isNaN(cursor)) {
      return null;
    }

    return cursor;
  } catch (err) {
    return null;
  }
}

function parseCursor(value: string): Cursor {
  if (value.endsWith("Z")) {
    const date = DateTime.fromISO(value, {});
    if (!date.isValid) {
      return parseIntegerCursor(value);
    }

    return date.toJSDate();
  }

  return parseIntegerCursor(value);
}

export default new GraphQLScalarType({
  name: "Cursor",
  description: "Cursor represents a paginating cursor.",
  serialize(value) {
    switch (typeof value) {
      case "object":
        if (value instanceof Date) {
          return value.toISOString();
        } else if (value instanceof DateTime) {
          return value.toISO();
        }

        return null;
      case "number":
        return value.toString();
      case "string":
        return value;
      default:
        return null;
    }
  },
  parseValue(value) {
    if (typeof value === "string") {
      return parseCursor(value);
    }

    return null;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        // This handles an empty string.
        if (!ast.value || ast.value.length === 0) {
          return null;
        }

        return parseCursor(ast.value);
      case Kind.INT:
        return parseIntegerCursor(ast.value);
      default:
        return null;
    }
  },
});
