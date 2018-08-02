import { mount, shallow } from "enzyme";
import React from "react";
import { MediaQueryMatchers } from "react-responsive";

import { PropTypesOf } from "talk-ui/types";

import UIContext from "../UIContext";
import { default as MatchMediaWithContext, MatchMedia } from "./MatchMedia";

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

it("should get mediaQueryValues from context", () => {
  const mediaQueryValues: Partial<MediaQueryMatchers> = {
    width: 100,
  };
  const context: any = {
    mediaQueryValues,
  };
  const wrapper = mount(
    <UIContext.Provider value={context}>
      <MatchMediaWithContext maxWidth="xs">
        <span>Hello World</span>
      </MatchMediaWithContext>
    </UIContext.Provider>
  );
  expect(wrapper.find(MatchMedia).prop("values")).toEqual(mediaQueryValues);
});
