import { Environment, ROOT_ID } from "relay-runtime";

export default function getViewerSourceID(
  environment: Environment
): string | null {
  const source = environment.getStore().getSource();
  const root = source.get(ROOT_ID)!;
  if (!root.viewer) {
    return null;
  }
  return (root.viewer as any).__ref;
}
