import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import MainLayout from "./MainLayout";

it("renders correctly", () => {
  const props: PropTypesOf<typeof MainLayout> = {
    children: "content",
  };
  const renderer = createRenderer();

  renderer.render(<MainLayout {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
