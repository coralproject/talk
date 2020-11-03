import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import SignUp from "./SignUp";

const SignUpN = removeFragmentRefs(SignUp);

it("renders correctly", () => {
  const props: PropTypesOf<typeof SignUpN> = {
    onSignIn: noop,
    localEnabled: true,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
  };
  const renderer = createRenderer();
  renderer.render(<SignUpN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders without email sign up", () => {
  const props: PropTypesOf<typeof SignUpN> = {
    onSignIn: noop,
    localEnabled: false,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
  };
  const renderer = createRenderer();
  renderer.render(<SignUpN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
