import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import NavigationItem from "./NavigationItem";

it("renders correctly", () => {
  const props: PropTypesOf<typeof NavigationItem> = {
    href: "/moderate",
    children: "link",
    onClick: noop,
    active: true,
    className: "custom",
  };
  const renderer = createRenderer();
  renderer.render(<NavigationItem {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
