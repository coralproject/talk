import { shallow } from "enzyme";
import React from "react";

import DecisionHistoryLoading from "./DecisionHistoryLoading";

it("renders correctly", () => {
  const wrapper = shallow(<DecisionHistoryLoading />);
  expect(wrapper).toMatchSnapshot();
});
