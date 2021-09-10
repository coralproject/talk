import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-framework/types";
import { UIContext, UIContextProps } from "coral-ui/components/v2";

import TopBarLeft from "./TopBarLeft";

it("renders correctly on small screens", () => {
  const props: PropTypesOf<typeof TopBarLeft> = {
    children: <div>Hello World</div>,
  };

  const context: UIContextProps = {
    mediaQueryValues: {
      width: 320,
    },
    renderWindow: window,
  };

  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <TopBarLeft {...props} />
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("renders correctly on big screens", () => {
  const props: PropTypesOf<typeof TopBarLeft> = {
    children: <div>Hello World</div>,
  };

  const context: UIContextProps = {
    mediaQueryValues: {
      width: 1600,
    },
    renderWindow: window,
  };

  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <TopBarLeft {...props} />
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
