import { shallow } from "enzyme";
import React from "react";

import Navigation from "./Navigation";

it("renders correctly", () => {
  const wrapper = shallow(<Navigation />);
  expect(wrapper).toMatchSnapshot();
});
