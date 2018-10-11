import { shallow } from "enzyme";
import React from "react";

import App from "./App";

it("renders correctly", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});
