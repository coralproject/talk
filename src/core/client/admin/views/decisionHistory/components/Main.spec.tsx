import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Main from "./Main";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Main> = {
    children: "children",
  };
  const wrapper = shallow(<Main {...props} />);
  expect(wrapper).toMatchSnapshot();
});
