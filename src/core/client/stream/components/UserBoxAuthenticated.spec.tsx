import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import UserBoxAuthenticated from "./UserBoxAuthenticated";

it("renders correctly with logout button", () => {
  const props: PropTypesOf<typeof UserBoxAuthenticated> = {
    onSignOut: noop,
    username: "Username",
    showLogoutButton: true,
  };
  const wrapper = shallow(<UserBoxAuthenticated {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly without logout button", () => {
  const props: PropTypesOf<typeof UserBoxAuthenticated> = {
    onSignOut: noop,
    username: "Username",
    showLogoutButton: false,
  };
  const wrapper = shallow(<UserBoxAuthenticated {...props} />);
  expect(wrapper).toMatchSnapshot();
});
