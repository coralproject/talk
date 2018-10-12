import { shallow } from "enzyme";
import React from "react";

import Counter from "./Counter";

it("renders correctly", () => {
  const wrapper = shallow(<Counter>20</Counter>);
  expect(wrapper).toMatchSnapshot();
});
