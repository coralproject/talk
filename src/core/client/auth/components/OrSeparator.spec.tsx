import { shallow } from "enzyme";
import React from "react";

import OrSeparator from "./OrSeparator";

it("renders correctly", () => {
  const wrapper = shallow(<OrSeparator />);
  expect(wrapper).toMatchSnapshot();
});
