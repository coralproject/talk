import { shallow } from "enzyme";
import React from "react";

import Moderate from "./Moderate";

it("renders correctly", () => {
  const wrapper = shallow(<Moderate />);
  expect(wrapper).toMatchSnapshot();
});
