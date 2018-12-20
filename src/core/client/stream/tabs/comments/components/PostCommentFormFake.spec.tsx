import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import PostCommentFormFake from "./PostCommentFormFake";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<PostCommentFormFake />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
