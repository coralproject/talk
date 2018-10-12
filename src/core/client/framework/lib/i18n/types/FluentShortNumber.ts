import { FluentBundle, FluentNumber, FluentType } from "fluent/compat";

const formatRegExp = /^(0+|0+\.0+)[^\d\.]+$/;

export function validateFormat(fmt: string) {
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

function formatShortNumber(n: number, format: string, bundle: FluentBundle) {
  const lastIndexOf0 = format.lastIndexOf("0");
  const unit = format.substr(lastIndexOf0 + 1);
  const rest = format.substr(0, lastIndexOf0 + 1);
  const splitted = rest.split(".");
  const digits = splitted[0].length;
  const fractalDigits = (splitted.length > 1 && splitted[1].length) || 0;
  const threshold = Math.pow(10, digits);
  while (n > threshold) {
    n /= 10;
  }
  const formattedNumber = new FluentNumber(n, {
    maximumFractionDigits: fractalDigits,
  }).toString(bundle);
  return `${formattedNumber}${unit}`;
}

export default class FluentShortNumber extends FluentNumber {
  constructor(value: any, opts?: any) {
    super(value, opts);
  }

  public toString(bundle: FluentBundle) {
    if (this.value < 1000) {
      return super.toString(bundle);
    }
    const key = `framework-shortNumber-${getShortNumberCode(this.value)}`;
    const fmt = bundle.getMessage(key);

    // Handle message not found.
    if (!fmt) {
      const message = `Missing translation key for ${key} for languages ${bundle.locales.toString()}`;
      if (process.env.NODE_ENV === "production") {
        // tslint:disable-next-line:no-console
        console.warn(message);
      } else {
        throw new Error(message);
      }
      return super.toString(bundle);
    }

    // Check for invalid message.
    if (!validateFormat(fmt)) {
      const message = `Invalid Short Number Format ${fmt}`;
      if (process.env.NODE_ENV === "production") {
        // tslint:disable-next-line:no-console
        console.warn(message);
      } else {
        throw new Error(message);
      }
      return super.toString(bundle);
    }

    return formatShortNumber(this.value, fmt, bundle);
  }

  public match(bundle: FluentBundle, other: FluentType) {
    if (other instanceof FluentShortNumber) {
      return this.value === other.valueOf;
    }

    return false;
  }
}
