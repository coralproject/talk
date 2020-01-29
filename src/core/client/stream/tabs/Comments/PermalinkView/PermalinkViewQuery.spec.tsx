import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { render } from "./PermalinkViewQuery";

it("renders permalink view container", () => {
  const data = {
    props: {
      story: {},
      comment: {},
    } as any,
    error: null,
    retry: noop,
  };
  const renderer = createRenderer();
  renderer.render(React.createElement(() => render(data)));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders loading", () => {
  const data = {
    props: null,
    error: null,
    retry: noop,
  };
  const renderer = createRenderer();
  renderer.render(React.createElement(() => render(data)));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders error", () => {
  const data = {
    props: null,
    error: new Error("error"),
    retry: noop,
  };
  const renderer = createRenderer();
  renderer.render(React.createElement(() => render(data)));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
