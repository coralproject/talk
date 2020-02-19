import {
  FluentBundle,
  FluentNumber,
  FluentScope,
  FluentType,
  Pattern,
} from "@fluent/bundle/compat";

const formatRegExp = /^(0+|0+\.0+)[^\d.]+$/;

export function validatePattern(fmt: Pattern) {
  return formatRegExp.test(fmt);
}

export function getShortNumberCode(n: number) {
  let code = "1";
  while (n >= 10) {
    n /= 10;
    code += "0";
  }
  return code;
}

function formatShortNumber(n: number, format: Pattern, scope: FluentScope) {
  const lastIndexOf0 = format.lastIndexOf("0");
  const unit = format.substr(lastIndexOf0 + 1);
  const rest = format.substr(0, lastIndexOf0 + 1);
  const splitted = rest.split(".");
  const digits = splitted[0].length;
  const fractionDigits = (splitted.length > 1 && splitted[1].length) || 0;
  const threshold = Math.pow(10, digits);

  while (n >= threshold) {
    n /= 10;
  }
  const formattedNumber = new FluentNumber(n, {
    maximumFractionDigits: fractionDigits,
  }).toString(scope);
  return `${formattedNumber}${unit}`;
}

export default class FluentShortNumber extends FluentNumber {
  constructor(value: any, opts?: any) {
    super(value, opts);
  }

  public toString(scope: FluentScope) {
    if (this.value < 1000) {
      return super.toString(scope);
    }
    const key = `framework-shortNumber-${getShortNumberCode(this.value)}`;
    const fmt = scope.bundle.getMessage(key);

    // Handle message not found.
    if (!fmt) {
      const message = `Missing translation key for ${key} for languages ${scope.bundle.locales.toString()}`;
      if (process.env.NODE_ENV === "production") {
        // eslint-disable-next-line no-console
        console.warn(message);
      } else {
        throw new Error(message);
      }
      return super.toString(scope);
    }

    // Check for invalid message.
    if (!fmt.value || !validatePattern(fmt.value)) {
      const message = `Invalid Short Number Format ${fmt.value}`;
      if (process.env.NODE_ENV === "production") {
        // eslint-disable-next-line no-console
        console.warn(message);
      } else {
        throw new Error(message);
      }
      return super.toString(scope);
    }

    return formatShortNumber(this.value, fmt.value, scope);
  }

  public match(bundle: FluentBundle, other: FluentType) {
    if (other instanceof FluentShortNumber) {
      return this.value === other.valueOf;
    }

    return false;
  }
}
