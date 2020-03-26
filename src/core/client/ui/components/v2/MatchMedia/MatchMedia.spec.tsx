import { mount } from "enzyme";
import React from "react";
import { MediaQueryMatchers } from "react-responsive";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-ui/types";

import UIContext from "../UIContext";
import { default as MatchMediaWithContext, MatchMedia } from "./MatchMedia";

it("renders correctly", () => {
  const props: PropTypesOf<typeof MatchMedia> = {
    lteWidth: "xs",
    gteWidth: "sm",
    component: "div",
    screen: true,
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<MatchMedia {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders less than and great than correctly", () => {
  const props: PropTypesOf<typeof MatchMedia> = {
    ltWidth: "xs",
    gtWidth: "sm",
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<MatchMedia {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("map new speech prop to older aural prop", () => {
  const props: PropTypesOf<typeof MatchMedia> = {
    speech: true,
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<MatchMedia {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
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
      <MatchMediaWithContext lteWidth="xs">
        <span>Hello World</span>
      </MatchMediaWithContext>
    </UIContext.Provider>
  );
  expect(wrapper.find(MatchMedia).prop("values")).toEqual(mediaQueryValues);
});
