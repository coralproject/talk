import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "talk-framework/types";
import { UIContext, UIContextProps } from "talk-ui/components";

import Username from "./Username";

it("renders correctly on small screens", () => {
  const props: PropTypesOf<typeof Username> = {
    children: "Marvin",
  };

  const context: UIContextProps = {
    mediaQueryValues: {
      width: 320,
    },
  };

  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <Username {...props} />
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("renders correctly on big screens", () => {
  const props: PropTypesOf<typeof Username> = {
    children: "Marvin",
  };

  const context: UIContextProps = {
    mediaQueryValues: {
      width: 1600,
    },
  };

  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <Username {...props} />
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
