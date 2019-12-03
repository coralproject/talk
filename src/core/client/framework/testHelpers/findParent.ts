import { ReactTestInstance } from "react-test-renderer";

export default function findParent(
  instance: ReactTestInstance,
  matcher: (i: ReactTestInstance) => boolean
): ReactTestInstance | null {
  if (matcher(instance)) {
    return instance;
  }
  if (instance.parent) {
    return findParent(instance.parent, matcher);
  }
  return null;
}
