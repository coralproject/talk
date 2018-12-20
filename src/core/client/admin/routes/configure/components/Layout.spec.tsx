import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import Layout from "./Layout";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Layout> = {
    children: "child",
  };
  const renderer = createRenderer();
  renderer.render(<Layout {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
