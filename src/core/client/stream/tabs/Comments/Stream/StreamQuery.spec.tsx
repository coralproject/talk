import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { render } from "./StreamQuery";

it("renders stream container", () => {
  const data = {
    props: {
      story: {},
    } as any,
    error: null,
  };
  const renderer = createRenderer();
  renderer.render(React.createElement(() => render(data, "CREATED_AT_ASC")));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders loading", () => {
  const data = {
    props: null,
    error: null,
  };
  const renderer = createRenderer();
  renderer.render(React.createElement(() => render(data, "CREATED_AT_ASC")));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders error", () => {
  const data = {
    props: null,
    error: new Error("error"),
  };
  const renderer = createRenderer();
  renderer.render(React.createElement(() => render(data, "CREATED_AT_ASC")));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
