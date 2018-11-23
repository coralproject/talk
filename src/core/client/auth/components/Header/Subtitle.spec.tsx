import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Subtitle from "./Subtitle";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Subtitle> = {
    children: "Hello World",
  };
  const wrapper = shallow(<Subtitle {...props} />);
  expect(wrapper).toMatchSnapshot();
});
