import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import UserMenu from "./UserMenu";

it("renders correctly", () => {
  const props: PropTypesOf<typeof UserMenu> = {
    username: "Admin",
    onSignOut: noop as any,
  };
  const renderer = createRenderer();
  renderer.render(<UserMenu {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
