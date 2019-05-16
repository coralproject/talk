import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import UserBoxUnauthenticated from "./UserBoxUnauthenticated";

it("renders correctly", () => {
  const props: PropTypesOf<typeof UserBoxUnauthenticated> = {
    onSignIn: noop,
    onRegister: noop,
    showRegisterButton: true,
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxUnauthenticated {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly hides showRegisterButton", () => {
  const props: PropTypesOf<typeof UserBoxUnauthenticated> = {
    onSignIn: noop,
    onRegister: noop,
    showRegisterButton: false,
  };
  const renderer = createRenderer();
  renderer.render(<UserBoxUnauthenticated {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
