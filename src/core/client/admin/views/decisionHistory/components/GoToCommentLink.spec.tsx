import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import GoToCommentLink from "./GoToCommentLink";

it("renders correctly", () => {
  const props: PropTypesOf<typeof GoToCommentLink> = {
    href: "#",
    onClick: noop,
  };
  const renderer = createRenderer();
  renderer.render(<GoToCommentLink {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
