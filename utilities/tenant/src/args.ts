export enum ArgumentValueType {
  Boolean = "boolean",
  Integer = "integer",
  String = "string",
  Command = "command",
}

export interface ArgumentDefinition {
  fullName: string;
  shortName: string;
  valueType: ArgumentValueType;
}

interface Result {
  ok: boolean;
  errors: Error[];
  args: ArgumentResult<any>[];
}

interface ArgumentResult<T> {
  definition: ArgumentDefinition;
  value: T;
}

interface ParseResult<T> {
  ok: boolean;
  value: ArgumentResult<T>;
  err?: Error;
}

const parseBool = (value: string) => {
  const lower = value.toLowerCase();
  if (lower === "true" || lower === "t" || lower === "1") {
    return true;
  } else {
    return false;
  }
};

const parseArgument = (value: string, definition: ArgumentDefinition) => {
  const { valueType: type } = definition;

  if (type === ArgumentValueType.Boolean) {
    try {
      const v = parseBool(value);
      const r: ParseResult<boolean> = {
        ok: true,
        value: {
          definition,
          value: v,
        },
      };
      return r;
    } catch {
      const r: ParseResult<boolean> = {
        ok: false,
        value: {
          definition,
          value: false,
        },
        err: new Error(`unable to parse ${value}`),
      };
      return r;
    }
  }
  if (type === ArgumentValueType.Integer) {
    try {
      const v = parseInt(value);
      const r: ParseResult<number> = {
        ok: true,
        value: {
          definition,
          value: v,
        },
      };
      return r;
    } catch {
      const r: ParseResult<number> = {
        ok: false,
        value: {
          definition,
          value: 0,
        },
        err: new Error(`unable to parse ${value}`),
      };
      return r;
    }
  }
  if (type === ArgumentValueType.String) {
    try {
      const r: ParseResult<string> = {
        ok: true,
        value: {
          definition,
          value,
        },
      };
      return r;
    } catch {
      const r: ParseResult<string> = {
        ok: false,
        value: {
          definition,
          value: "",
        },
        err: new Error(`unable to parse ${value}`),
      };
      return r;
    }
  }
};

export const getArgs = (argv: string[], definition: ArgumentDefinition[]) => {
  const result: Result = {
    ok: true,
    errors: [],
    args: [],
  };

  for (let a = 0; a < argv.length; a++) {
    const arg = argv[a];
    const lowerArg = arg.toLowerCase();

    for (const def of definition) {
      const lowerFullName = def.fullName.toLowerCase().trim();

      const matchShort = arg.trim() === def.shortName.trim();
      const matchFull = lowerArg.startsWith(lowerFullName);
      const isMatch = matchShort || matchFull;

      if (!isMatch) {
        continue;
      }

      if (def.valueType === ArgumentValueType.Command) {
        result.args.push({
          definition: def,
          value: def.valueType.toString()
        });
      } else {
        if (argv.length >= a + 2) {
          const value = argv[a + 1];

          const parseResult = parseArgument(value, def);
          if (!parseResult) {
            result.ok = false;
            result.errors.push(
              new Error(`unable to parse value for ${arg} with input ${value}`)
            );
            continue;
          }

          if (!parseResult.ok) {
            result.ok = false;

            result.errors.push(
              new Error(`unable to parse value for ${arg} with input ${value}`)
            );
            if (parseResult.err) {
              result.errors.push(parseResult.err);
            }
            continue;
          }

          result.args.push(parseResult.value);
        } else {
          result.ok = false;
          result.errors.push(new Error(`unable to find value for ${arg}`));
        }
      }
    }
  }

  return result;
};
