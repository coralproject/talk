import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import App from "./App";

it("renders correctly", () => {
  const props: PropTypesOf<typeof App> = {
    children: "child",
  };
  const renderer = createRenderer();

  renderer.render(<App {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
