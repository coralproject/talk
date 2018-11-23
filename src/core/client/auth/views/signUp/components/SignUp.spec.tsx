import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import SignUp from "./SignUp";

const SignUpN = removeFragmentRefs(SignUp);

it("renders correctly", () => {
  const props: PropTypesOf<typeof SignUpN> = {
    onGotoSignIn: noop,
    emailEnabled: true,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
  };
  const wrapper = shallow(<SignUpN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders without email sign up", () => {
  const props: PropTypesOf<typeof SignUpN> = {
    onGotoSignIn: noop,
    emailEnabled: false,
    facebookEnabled: true,
    googleEnabled: true,
    oidcEnabled: true,
    auth: {},
  };
  const wrapper = shallow(<SignUpN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
