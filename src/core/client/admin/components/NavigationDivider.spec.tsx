import { shallow } from "enzyme";
import React from "react";

import NavigationDivider from "./NavigationDivider";

it("renders correctly", () => {
  const wrapper = shallow(<NavigationDivider />);
  expect(wrapper).toMatchSnapshot();
});
