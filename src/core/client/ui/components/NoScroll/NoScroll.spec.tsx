import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";

import { act } from "coral-framework/testHelpers";

import NoScroll from "./NoScroll";

it("renders correctly", () => {
  expect(document.body.className).toBe("");
  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(<NoScroll active />);
  });
  expect(document.body.className).toBe("NoScroll-noScroll");
  act(() => {
    testRenderer.update(<NoScroll />);
  });
  expect(document.body.className).toBe("");
});

it("renders correctly with multiple instances", () => {
  expect(document.body.className).toBe("");
  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <>
        <NoScroll active />
        <NoScroll active />
        <NoScroll active />
      </>
    );
  });
  expect(document.body.className).toBe("NoScroll-noScroll");
  act(() => {
    testRenderer.update(
      <>
        <NoScroll />
        <NoScroll />
        <NoScroll active />
      </>
    );
  });
  expect(document.body.className).toBe("NoScroll-noScroll");
  act(() => {
    testRenderer.update(
      <>
        <NoScroll />
        <NoScroll />
        <NoScroll />
      </>
    );
  });
  expect(document.body.className).toBe("");
});
