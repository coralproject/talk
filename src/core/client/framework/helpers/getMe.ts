declare module "relay-runtime" {
  export const ROOT_ID: string;
}

import { Environment, ROOT_ID } from "relay-runtime";

export default function getMe(environment: Environment) {
  const source = environment.getStore().getSource();
  const root = source.get(ROOT_ID)!;
  const meKey = Object.keys(root).find(s => s.startsWith("me("))!;
  if (!root[meKey]) {
    return null;
  }
  const meID = root[meKey].__ref;
  return source.get(meID)!;
}
