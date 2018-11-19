import { shallow } from "enzyme";
import React from "react";

import HorizontalRule from "./HorizontalRule";

it("renders correctly", () => {
  const wrapper = shallow(<HorizontalRule />);
  expect(wrapper).toMatchSnapshot();
});
