import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import InReplyTo from "./InReplyTo";

it("renders correctly", () => {
  const props: PropTypesOf<typeof InReplyTo> = {
    parent: {
      author: {
        username: "Username",
      },
    },
    isLink: false,
  };
  const renderer = createRenderer();
  renderer.render(<InReplyTo {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
