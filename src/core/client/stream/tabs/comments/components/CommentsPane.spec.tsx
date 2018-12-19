import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import CommentsPane from "./CommentsPane";

it("renders stream", () => {
  const props: PropTypesOf<typeof CommentsPane> = {
    showPermalinkView: false,
  };
  const renderer = createRenderer();
  renderer.render(<CommentsPane {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders permalink view", () => {
  const props: PropTypesOf<typeof CommentsPane> = {
    showPermalinkView: true,
  };
  const renderer = createRenderer();
  renderer.render(<CommentsPane {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
