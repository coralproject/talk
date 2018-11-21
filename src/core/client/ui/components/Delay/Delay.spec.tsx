import React from "react";
import TestRenderer from "react-test-renderer";
import timekeeper from "timekeeper";

import { PropTypesOf } from "talk-ui/types";

import Delay from "./Delay";

it("renders correctly", () => {
  jest.useFakeTimers();
  try {
    const props: PropTypesOf<typeof Delay> = {
      children: "custom",
      ms: 3000,
    };
    const renderer = TestRenderer.create(<Delay {...props}>Hello</Delay>);
    expect(renderer.toJSON()).toMatchSnapshot();
    jest.advanceTimersByTime(3000);
    expect(renderer.toJSON()).toMatchSnapshot();
  } finally {
    jest.useRealTimers();
  }
});
