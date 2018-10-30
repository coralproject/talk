import { shallow } from "enzyme";
import React from "react";

import Community from "./Community";

it("renders correctly", () => {
  const wrapper = shallow(<Community />);
  expect(wrapper).toMatchSnapshot();
});
