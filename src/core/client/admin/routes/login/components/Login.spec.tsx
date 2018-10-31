import { shallow } from "enzyme";
import React from "react";

import Login from "./Login";

it("renders correctly", () => {
  const wrapper = shallow(<Login />);
  expect(wrapper).toMatchSnapshot();
});
