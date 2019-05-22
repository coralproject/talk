import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Footer from "./Footer";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Footer> = {
    children: "children",
  };
  const renderer = createRenderer();
  renderer.render(<Footer {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
