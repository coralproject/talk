jest.mock("react-transition-group", () => ({
  CSSTransition: (props: { children: React.ReactNode }) => props.children,
  Transition: (props: { children: React.ReactNode }) => props.children,
  TransitionGroup: (props: { children: React.ReactNode }) => props.children,
}));

jest.mock("react-dom", () => ({
  ...require.requireActual("react-dom"),
  createPortal: (node: any) => node,
}));

jest.mock("popper.js", () => {
  const PopperJS = require.requireActual("popper.js");

  return class Popper {
    public static placements = PopperJS.placements;

    constructor() {
      return {
        // eslint-disable-next-line:no-empty
        destroy: () => {},
        // eslint-disable-next-line:no-empty
        scheduleUpdate: () => {},
      };
    }
  };
});
