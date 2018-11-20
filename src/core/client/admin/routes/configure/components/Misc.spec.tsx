import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Misc from "./Misc";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Misc> = {
    children: "child",
  };
  const wrapper = shallow(<Misc {...props} />);
  expect(wrapper).toMatchSnapshot();
});
