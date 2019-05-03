import { ReactTestInstance } from "react-test-renderer";

export default function findParentWithType(
  instance: ReactTestInstance,
  selector:
    | string
    | React.ComponentClass<any>
    | React.FunctionComponent<any> = "*"
): ReactTestInstance | null {
  if (selector === "*") {
    return instance;
  }
  if (instance.type === selector) {
    return instance;
  }
  if (instance.parent) {
    return findParentWithType(instance.parent, selector);
  }
  return null;
}
