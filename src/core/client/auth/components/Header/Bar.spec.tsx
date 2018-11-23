import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Bar from "./Bar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Bar> = {
    children: "Hello World",
  };
  const wrapper = shallow(<Bar {...props} />);
  expect(wrapper).toMatchSnapshot();
});
