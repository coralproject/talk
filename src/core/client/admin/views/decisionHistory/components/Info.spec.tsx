import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Info from "./Info";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Info> = {
    children: "children",
  };
  const wrapper = shallow(<Info {...props} />);
  expect(wrapper).toMatchSnapshot();
});
