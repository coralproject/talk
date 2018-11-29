import { shallow } from "enzyme";
import React from "react";

import AcceptedIcon from "./AcceptedIcon";

it("renders correctly", () => {
  const wrapper = shallow(<AcceptedIcon />);
  expect(wrapper).toMatchSnapshot();
});
