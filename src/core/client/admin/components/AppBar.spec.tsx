import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import AppBar from "./AppBar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof AppBar> = {
    children: "child",
  };
  const wrapper = shallow(<AppBar {...props} />);
  expect(wrapper).toMatchSnapshot();
});
