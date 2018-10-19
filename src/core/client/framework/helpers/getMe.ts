import { Environment } from "relay-runtime";

import getMeSourceID from "./getMeSourceID";

export default function getMe(environment: Environment) {
  const source = environment.getStore().getSource();
  const meID = getMeSourceID(environment);
  if (!meID) {
    return null;
  }
  return source.get(meID)!;
}
