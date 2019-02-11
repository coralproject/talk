import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Markdown from "./Markdown";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Markdown>**bold**</Markdown>);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
