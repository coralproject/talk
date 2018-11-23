import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import FacebookButton from "./FacebookButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof FacebookButton> = {
    onClick: noop,
    children: "Login with Facebook",
  };
  const wrapper = shallow(<FacebookButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});
