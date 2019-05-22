import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import NavigationLink from "./NavigationLink";

it("renders correctly", () => {
  const props: PropTypesOf<typeof NavigationLink> = {
    to: "/moderate",
    children: "link",
  };
  const renderer = createRenderer();
  renderer.render(<NavigationLink {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
