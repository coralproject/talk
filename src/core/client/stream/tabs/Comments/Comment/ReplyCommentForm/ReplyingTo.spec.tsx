import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import ReplyingTo from "./ReplyingTo";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyingTo> = {
    username: "ParentAuthor",
  };
  const renderer = createRenderer();
  renderer.render(<ReplyingTo {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
