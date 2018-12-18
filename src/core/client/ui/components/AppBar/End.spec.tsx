import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import End from "./End";

it("renders correctly", () => {
  const props: PropTypesOf<typeof End> = {
    children: "children",
    className: "custom",
    itemGutter: true,
  };
  const wrapper = shallow(<End {...props} />);
  expect(wrapper).toMatchSnapshot();
});
