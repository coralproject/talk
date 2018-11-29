import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import DecisionItem from "./DecisionItem";

it("renders correctly", () => {
  const props: PropTypesOf<typeof DecisionItem> = {
    icon: "icon",
    children: "children",
  };
  const wrapper = shallow(<DecisionItem {...props} />);
  expect(wrapper).toMatchSnapshot();
});
