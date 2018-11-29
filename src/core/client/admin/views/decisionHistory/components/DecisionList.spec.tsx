import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import DecisionList from "./DecisionList";

it("renders correctly", () => {
  const props: PropTypesOf<typeof DecisionList> = {
    children: "children",
  };
  const wrapper = shallow(<DecisionList {...props} />);
  expect(wrapper).toMatchSnapshot();
});
