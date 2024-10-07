// eslint-disable-next-line @typescript-eslint/tslint/config
import { TextEncoder, TextDecoder } from "util";

export const patchTextUtil = () => {
  const glob = global as any;
  glob.TextEncoder = TextEncoder;
  glob.TextDecoder = TextDecoder;
};
