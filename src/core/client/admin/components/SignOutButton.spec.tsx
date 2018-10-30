import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import SignOutButton from "./SignOutButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof SignOutButton> = {
    id: "id",
    onClick: noop,
  };
  const wrapper = shallow(<SignOutButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});
