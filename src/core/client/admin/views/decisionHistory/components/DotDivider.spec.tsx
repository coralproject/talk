import { shallow } from "enzyme";
import React from "react";

import DotDivider from "./DotDivider";

it("renders correctly", () => {
  const wrapper = shallow(<DotDivider />);
  expect(wrapper).toMatchSnapshot();
});
