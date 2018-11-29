import { ReactTestInstance } from "react-test-renderer";

export default function findWithTestID(
  id: string,
  instance: ReactTestInstance
) {
  return instance.findByProps({ "data-test": id });
}
