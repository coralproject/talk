import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import ButtonsBar from "./ButtonsBar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ButtonsBar> = {
    children: "children",
  };
  const wrapper = shallow(<ButtonsBar {...props} />);
  expect(wrapper).toMatchSnapshot();
});
