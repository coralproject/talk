import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";

import { act } from "coral-framework/testHelpers";

import UIContext, { UIContextProps } from "../UIContext";
import NoScroll from "./NoScroll";

it("renders correctly", () => {
  const context: UIContextProps = {
    renderWindow: window,
  };
  expect(document.body.className).toBe("");
  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <UIContext.Provider value={context}>
        <NoScroll active />
      </UIContext.Provider>
    );
  });
  expect(document.body.className).toBe("NoScroll-noScroll");
  act(() => {
    testRenderer.update(<NoScroll />);
  });
  expect(document.body.className).toBe("");
});

it("renders correctly with multiple instances", () => {
  const context: UIContextProps = {
    renderWindow: window,
  };
  expect(document.body.className).toBe("");
  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <UIContext.Provider value={context}>
        <NoScroll active />
        <NoScroll active />
        <NoScroll active />
      </UIContext.Provider>
    );
  });
  expect(document.body.className).toBe("NoScroll-noScroll");
  act(() => {
    testRenderer.update(
      <UIContext.Provider value={context}>
        <NoScroll />
        <NoScroll />
        <NoScroll active />
      </UIContext.Provider>
    );
  });
  expect(document.body.className).toBe("NoScroll-noScroll");
  act(() => {
    testRenderer.update(
      <UIContext.Provider value={context}>
        <NoScroll />
        <NoScroll />
        <NoScroll />
      </UIContext.Provider>
    );
  });
  expect(document.body.className).toBe("");
});
