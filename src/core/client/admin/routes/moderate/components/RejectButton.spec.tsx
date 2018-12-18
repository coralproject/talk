import { shallow } from "enzyme";
import React from "react";

import RejectButton from "./RejectButton";

import { PropTypesOf } from "talk-framework/types";

it("renders correctly", () => {
  const props: PropTypesOf<typeof RejectButton> = {
    invert: false,
  };
  const wrapper = shallow(<RejectButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly inverted", () => {
  const props: PropTypesOf<typeof RejectButton> = {
    invert: true,
  };
  const wrapper = shallow(<RejectButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});
