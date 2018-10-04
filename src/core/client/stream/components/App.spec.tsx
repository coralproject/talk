import { shallow } from "enzyme";
import React from "react";

import AppContainer from "../containers/AppContainer";

it("renders comments", () => {
  const wrapper = shallow(<AppContainer />);
  expect(wrapper).toMatchSnapshot();
});
