import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Header from "./Header";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Header> = {
    children: "child",
  };
  const wrapper = shallow(<Header {...props} />);
  expect(wrapper).toMatchSnapshot();
});
