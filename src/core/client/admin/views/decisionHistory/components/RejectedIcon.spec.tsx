import { shallow } from "enzyme";
import React from "react";

import RejectedIcon from "./RejectedIcon";

it("renders correctly", () => {
  const wrapper = shallow(<RejectedIcon />);
  expect(wrapper).toMatchSnapshot();
});
