import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import Moderation from "./Moderation";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Moderation> = {
    children: "child",
  };
  const renderer = createRenderer();
  renderer.render(<Moderation {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
