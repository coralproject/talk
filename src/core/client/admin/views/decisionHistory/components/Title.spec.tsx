import { shallow } from "enzyme";
import React from "react";

import Title from "./Title";

it("renders correctly", () => {
  const wrapper = shallow(<Title />);
  expect(wrapper).toMatchSnapshot();
});
