import { shallow } from "enzyme";
import React from "react";

import Stories from "./Stories";

it("renders correctly", () => {
  const wrapper = shallow(<Stories />);
  expect(wrapper).toMatchSnapshot();
});
