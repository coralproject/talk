import { shallow } from "enzyme";
import React from "react";

import Username from "./Username";

it("renders correctly", () => {
  const props = {
    children: "Marvin",
  };
  const wrapper = shallow(<Username {...props} />);
  expect(wrapper).toMatchSnapshot();
});
