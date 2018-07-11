import { shallow } from "enzyme";
import React from "react";

import MatchMedia from "./MatchMedia";

it("renders correctly", () => {
  const props = {
    minWidth: "xs",
    maxWidth: "sm",
    component: "div",
    screen: true,
  };
  const wrapper = shallow(
    <MatchMedia {...props}>
      <div>Hello World</div>
    </MatchMedia>
  );
  expect(wrapper).toMatchSnapshot();
});

it("map new speech prop to older aural prop", () => {
  const props = {
    speech: true,
  };
  const wrapper = shallow(
    <MatchMedia {...props}>
      <div>Hello World</div>
    </MatchMedia>
  );
  expect(wrapper).toMatchSnapshot();
});
