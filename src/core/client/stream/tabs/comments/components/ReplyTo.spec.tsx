import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import ReplyTo from "./ReplyTo";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyTo> = {
    username: "ParentAuthor",
  };
  const renderer = createRenderer();
  renderer.render(<ReplyTo {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
