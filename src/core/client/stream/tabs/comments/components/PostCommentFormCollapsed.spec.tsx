import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import { PropTypesOf } from "talk-framework/types";

import PostCommentFormCollapsed from "./PostCommentFormCollapsed";

it("renders correctly when comments are closed sitewide", () => {
  const props: PropTypesOf<typeof PostCommentFormCollapsed> = {
    closedSitewide: true,
    closedMessage: "closed site-wide",
  };
  const renderer = createRenderer();
  renderer.render(<PostCommentFormCollapsed {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly when story is closed", () => {
  const props: PropTypesOf<typeof PostCommentFormCollapsed> = {
    closedSitewide: false,
    closedMessage: "closed story",
  };
  const renderer = createRenderer();
  renderer.render(<PostCommentFormCollapsed {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
