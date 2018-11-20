import { ReactTestInstance } from "react-test-renderer";

const inputPredicate = (nameOrID: string) => (n: ReactTestInstance) => {
  return (
    [n.props.name, n.props.id].indexOf(nameOrID) > -1 &&
    ["input", "button"].indexOf(n.type) > -1
  );
};

export default inputPredicate;
