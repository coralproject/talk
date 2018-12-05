import { shallow } from "enzyme";
import React from "react";

import Divider from "./Divider";

it("renders correctly", () => {
  const wrapper = shallow(<Divider />);
  expect(wrapper).toMatchSnapshot();
});
