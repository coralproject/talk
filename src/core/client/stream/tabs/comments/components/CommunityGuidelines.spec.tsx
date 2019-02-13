import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import CommunityGuidelines from "./CommunityGuidelines";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<CommunityGuidelines>**bold**</CommunityGuidelines>);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
