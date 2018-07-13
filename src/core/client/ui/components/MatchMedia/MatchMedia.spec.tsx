import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-ui/types";

import MatchMedia from "./MatchMedia";

it("renders correctly", () => {
  const props: PropTypesOf<typeof MatchMedia> = {
    minWidth: "xs",
    maxWidth: "sm",
    component: "div",
    screen: true,
    children: <div>Hello World</div>,
  };
  const wrapper = shallow(<MatchMedia {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("map new speech prop to older aural prop", () => {
  const props: PropTypesOf<typeof MatchMedia> = {
    speech: true,
    children: <div>Hello World</div>,
  };
  const wrapper = shallow(<MatchMedia {...props} />);
  expect(wrapper).toMatchSnapshot();
});
