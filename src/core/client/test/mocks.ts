jest.mock("fluent-intl-polyfill/compat", () => null);
jest.mock("react-transition-group", () => ({
  CSSTransition: (props: { children: React.ReactNode }) => props.children,
  Transition: (props: { children: React.ReactNode }) => props.children,
  TransitionGroup: (props: { children: React.ReactNode }) => props.children,
}));
