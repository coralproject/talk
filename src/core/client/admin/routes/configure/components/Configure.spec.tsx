import { shallow } from "enzyme";
import React from "react";

import Configure from "./Configure";

it("renders correctly", () => {
  const wrapper = shallow(<Configure />);
  expect(wrapper).toMatchSnapshot();
});
