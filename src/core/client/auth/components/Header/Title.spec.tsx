import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Title from "./Title";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Title> = {
    children: "Hello World",
  };
  const wrapper = shallow(<Title {...props} />);
  expect(wrapper).toMatchSnapshot();
});
