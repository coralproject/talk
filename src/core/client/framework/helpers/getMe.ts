import { Environment, ROOT_ID } from "relay-runtime";

export default function getMe(environment: Environment) {
  const source = environment.getStore().getSource();
  const root = source.get(ROOT_ID)!;
  if (!root.me) {
    return null;
  }
  const meID = root.me.__ref;
  return source.get(meID)!;
}
