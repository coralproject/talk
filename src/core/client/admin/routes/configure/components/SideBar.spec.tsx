import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import SideBar from "./SideBar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof SideBar> = {
    children: "child",
  };
  const wrapper = shallow(<SideBar {...props} />);
  expect(wrapper).toMatchSnapshot();
});
