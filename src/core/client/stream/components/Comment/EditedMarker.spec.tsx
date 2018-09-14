import { shallow } from "enzyme";
import React from "react";

import EditedMarker from "./EditedMarker";

it("renders correctly", () => {
  const wrapper = shallow(<EditedMarker />);
  expect(wrapper).toMatchSnapshot();
});
