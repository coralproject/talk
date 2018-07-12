import React from "react";
import TestRenderer from "react-test-renderer";

import { UIContext, UIContextProps } from "talk-ui/components";

import TopBar from "./TopBar";

it("renders correctly on small screens", () => {
  const props = {
    children: <div>Hello World</div>,
  };

  const context: UIContextProps = {
    mediaQueryValues: {
      width: 320,
    },
  };

  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <TopBar {...props} />
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("renders correctly on big screens", () => {
  const props = {
    children: <div>Hello World</div>,
  };

  const context: UIContextProps = {
    mediaQueryValues: {
      width: 1600,
    },
  };

  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <TopBar {...props} />
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
