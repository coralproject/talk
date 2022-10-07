import React from "react";
import TestRenderer from "react-test-renderer";

import { act, wait } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-ui/types";

import Delay from "./Delay";

it("renders correctly", async () => {
  jest.useFakeTimers();
  try {
    const props: PropTypesOf<typeof Delay> = {
      children: "custom",
      ms: 3000,
    };
    const renderer = TestRenderer.create(<Delay {...props}>Hello</Delay>);
    await wait(async () => {
      expect(renderer.toJSON()).toMatchSnapshot();
    });
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    await wait(async () => {
      expect(renderer.toJSON()).toMatchSnapshot();
    });
  } finally {
    jest.useRealTimers();
  }
});
