import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import SignIn from "./SignIn";

const SignInN = removeFragmentRefs(SignIn);

it("renders correctly", () => {
  const props: PropTypesOf<typeof SignInN> = {
    onGotoSignUp: noop,
    emailEnabled: true,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
  };
  const renderer = createRenderer();
  renderer.render(<SignInN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders without email login", () => {
  const props: PropTypesOf<typeof SignInN> = {
    onGotoSignUp: noop,
    emailEnabled: false,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
  };
  const renderer = createRenderer();
  renderer.render(<SignInN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
