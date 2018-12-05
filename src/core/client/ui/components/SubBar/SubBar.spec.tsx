import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import SubBar from "./SubBar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof SubBar> = {
    children: "child",
    gutterBegin: true,
    gutterEnd: true,
    className: "custom",
  };
  const wrapper = shallow(<SubBar {...props} />);
  expect(wrapper).toMatchSnapshot();
});
