import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import AuthBox from "./AuthBox";

it("renders correctly", () => {
  const props: PropTypesOf<typeof AuthBox> = {
    title: "title",
    children: "content",
  };
  const renderer = createRenderer();

  renderer.render(<AuthBox {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
