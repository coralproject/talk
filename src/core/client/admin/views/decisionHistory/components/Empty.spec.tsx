import { shallow } from "enzyme";
import React from "react";

import Empty from "./Empty";

it("renders correctly", () => {
  const wrapper = shallow(<Empty />);
  expect(wrapper).toMatchSnapshot();
});
