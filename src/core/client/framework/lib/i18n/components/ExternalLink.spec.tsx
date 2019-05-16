import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import ExternalLink from "./ExternalLink";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ExternalLink> = {
    children: "http://test.com",
  };
  const renderer = createRenderer();
  renderer.render(<ExternalLink {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
