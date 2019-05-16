import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import SignIn from "./SignIn";

const SignInN = removeFragmentRefs(SignIn);

it("renders correctly", () => {
  const props: PropTypesOf<typeof SignInN> = {
    onGotoSignUp: noop,
    signUpHref: "/signUp",
    emailEnabled: true,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
    error: null,
  };
  const renderer = createRenderer();
  renderer.render(<SignInN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders error", () => {
  const props: PropTypesOf<typeof SignInN> = {
    onGotoSignUp: noop,
    signUpHref: "/signUp",
    emailEnabled: true,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
    error: "Server Error",
  };
  const renderer = createRenderer();
  renderer.render(<SignInN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders without email login", () => {
  const props: PropTypesOf<typeof SignInN> = {
    onGotoSignUp: noop,
    signUpHref: "/signUp",
    emailEnabled: false,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
    error: null,
  };
  const renderer = createRenderer();
  renderer.render(<SignInN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
