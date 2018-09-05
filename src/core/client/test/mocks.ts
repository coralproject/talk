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

export interface UUIDMock {
  (): string;
  setMockData(mockData: string[]): void;
}

function mockUUID(): UUIDMock {
  const originalUUID = require.requireActual("uuid/v4");
  let mockData: string[] = [];
  const uuid: UUIDMock = (() => {
    return (mockData.length && mockData.splice(0, 1)[0]) || originalUUID();
  }) as any;
  uuid.setMockData = (nextMockData: string[]) => (mockData = nextMockData);
  return uuid;
}

jest.mock("react", () => mockReact());
jest.mock("uuid/v4", () => mockUUID());
