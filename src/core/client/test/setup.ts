import "./enzyme";
import "./jsdom";

// TODO: Remove when fixed.
// Mock React.createContext because of https://github.com/airbnb/enzyme/issues/1509.
function mockReact() {
  const originalReact = require.requireActual("react");
  return {
    ...originalReact,
    createContext: jest.fn(defaultValue => {
      let value = defaultValue;
      const Provider = (props: any) => {
        value = props.value;
        return props.children;
      };
      const Consumer = (props: any) => props.children(value);
      return {
        Provider,
        Consumer,
      };
    }),
  };
}
jest.mock("react", () => mockReact());
