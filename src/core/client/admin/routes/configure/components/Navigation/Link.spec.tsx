import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Link from "./Link";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Link> = {
    className: "customClassName",
    to: "/admin",
    children: "child",
  };
  const wrapper = shallow(<Link {...props} />);
  expect(wrapper).toMatchSnapshot();
});
