import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import NavigationLink from "./NavigationLink";

it("renders correctly", () => {
  const props: PropTypesOf<typeof NavigationLink> = {
    to: "/moderate",
    children: "link",
  };
  const wrapper = shallow(<NavigationLink {...props} />);
  expect(wrapper).toMatchSnapshot();
});
