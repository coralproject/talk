import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import NavigationItem from "./NavigationItem";

it("renders correctly", () => {
  const props: PropTypesOf<typeof NavigationItem> = {
    href: "/moderate",
    children: "link",
    onClick: noop,
    active: true,
    className: "custom",
  };
  const wrapper = shallow(<NavigationItem {...props} />);
  expect(wrapper).toMatchSnapshot();
});
