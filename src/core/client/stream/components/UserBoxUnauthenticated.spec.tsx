import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import UserBoxUnauthenticated from "./UserBoxUnauthenticated";

it("renders correctly", () => {
  const props: PropTypesOf<typeof UserBoxUnauthenticated> = {
    onSignIn: noop,
    onRegister: noop,
    showRegisterButton: true,
  };
  const wrapper = shallow(<UserBoxUnauthenticated {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly hides showRegisterButton", () => {
  const props: PropTypesOf<typeof UserBoxUnauthenticated> = {
    onSignIn: noop,
    onRegister: noop,
    showRegisterButton: false,
  };
  const wrapper = shallow(<UserBoxUnauthenticated {...props} />);
  expect(wrapper).toMatchSnapshot();
});
