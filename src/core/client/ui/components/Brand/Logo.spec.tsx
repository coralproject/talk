import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import Logo from "./Logo";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Logo> = {
    className: "custom",
  };
  const renderer = createRenderer();
  renderer.render(<Logo {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
