import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import Link from "./Link";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Link> = {
    className: "customClassName",
    to: "/admin",
    children: "child",
  };
  const renderer = createRenderer();
  renderer.render(<Link {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
