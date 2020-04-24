import { setLongTimeout } from "long-settimeout";
declare module "long-settimeout" {
  export type LongTimeout = ReturnType<typeof setLongTimeout>;
}
