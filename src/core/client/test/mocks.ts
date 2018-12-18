import React from "react";

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
jest.mock("react-transition-group", () => ({
  CSSTransition: (props: { children: React.ReactNode }) => props.children,
  Transition: (props: { children: React.ReactNode }) => props.children,
  TransitionGroup: (props: { children: React.ReactNode }) => props.children,
}));
