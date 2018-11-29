import { ReactTestInstance } from "react-test-renderer";

export default function getByTestID(id: string, instance: ReactTestInstance) {
  return instance.findByProps({ "data-test": id });
}
