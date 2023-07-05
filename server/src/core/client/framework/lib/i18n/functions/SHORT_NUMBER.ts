import { FluentNumber, FluentType } from "@fluent/bundle/compat";

import { FluentShortNumber } from "../types";

export default function SHORT_NUMBER([t]: [FluentType]) {
  if (!(t instanceof FluentNumber)) {
    throw new Error(`Invalid argument for SHORT_NUMBER ${t.valueOf()}`);
  }
  return new FluentShortNumber(t.valueOf());
}
