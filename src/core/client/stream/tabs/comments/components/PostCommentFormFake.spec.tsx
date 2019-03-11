import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import { removeFragmentRefs } from "talk-framework/testHelpers";

import PostCommentFormFake from "./PostCommentFormFake";

const PostCommentFormFakeN = removeFragmentRefs(PostCommentFormFake);

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<PostCommentFormFakeN story={{}} showMessageBox />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
