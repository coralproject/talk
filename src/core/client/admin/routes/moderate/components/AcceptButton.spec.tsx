import { shallow } from "enzyme";
import React from "react";

import AcceptButton from "./AcceptButton";

import { PropTypesOf } from "talk-framework/types";

it("renders correctly", () => {
  const props: PropTypesOf<typeof AcceptButton> = {
    invert: false,
  };
  const wrapper = shallow(<AcceptButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly inverted", () => {
  const props: PropTypesOf<typeof AcceptButton> = {
    invert: true,
  };
  const wrapper = shallow(<AcceptButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});
