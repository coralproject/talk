import { ReactTestInstance } from "react-test-renderer";

import findParentWithType from "./findParentWithType";

export default function findParentsWithType(
  instances: ReactTestInstance[],
  selector:
    | string
    | React.ComponentClass<any>
    | React.FunctionComponent<any> = "*"
): ReactTestInstance[] {
  return instances
    .map((i) => findParentWithType(i, selector))
    .filter((i) => i) as ReactTestInstance[];
}
