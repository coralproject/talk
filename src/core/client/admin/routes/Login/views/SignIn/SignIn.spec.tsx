import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import SignIn from "./SignIn";

const SignInN = removeFragmentRefs(SignIn);

it("renders correctly", () => {
  const renderer = createRenderer();
  const props: PropTypesOf<typeof SignInN> = {
    error: null,
    auth: {},
  };
  renderer.render(<SignInN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
