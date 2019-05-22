import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import UserBoxAuthenticated from "./UserBoxAuthenticated";

it("renders correctly with logout button", () => {
  const props: PropTypesOf<typeof UserBoxAuthenticated> = {
    onSignOut: noop,
    username: "Username",
    showLogoutButton: true,
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxAuthenticated {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly without logout button", () => {
  const props: PropTypesOf<typeof UserBoxAuthenticated> = {
    onSignOut: noop,
    username: "Username",
    showLogoutButton: false,
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxAuthenticated {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
