import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import UserBoxAuthenticated from "./UserBoxAuthenticated";

it("renders correctly", () => {
  const props: PropTypesOf<typeof UserBoxAuthenticated> = {
    onSignOut: noop,
    username: "Username",
  };
  const wrapper = shallow(<UserBoxAuthenticated {...props} />);
  expect(wrapper).toMatchSnapshot();
});
