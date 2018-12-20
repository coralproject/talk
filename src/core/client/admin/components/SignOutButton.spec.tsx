import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import SignOutButton from "./SignOutButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof SignOutButton> = {
    id: "id",
    onClick: noop,
  };
  const renderer = createRenderer();
  renderer.render(<SignOutButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
