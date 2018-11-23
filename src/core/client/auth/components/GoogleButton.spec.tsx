import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import GoogleButton from "./GoogleButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof GoogleButton> = {
    onClick: noop,
    children: "Login with Google",
  };
  const wrapper = shallow(<GoogleButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});
