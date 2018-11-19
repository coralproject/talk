import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Layout from "./Layout";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Layout> = {
    children: "child",
  };
  const wrapper = shallow(<Layout {...props} />);
  expect(wrapper).toMatchSnapshot();
});
