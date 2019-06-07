import TestRenderer from "react-test-renderer";

export default function act(
  callback: () => Promise<void> | void | undefined
): Promise<void> | void {
  return TestRenderer.act(callback as any) as any;
}
