import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import CompleteAccountBox from "./CompleteAccountBox";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CompleteAccountBox> = {
    title: "title",
    children: "content",
  };
  const renderer = createRenderer();

  renderer.render(<CompleteAccountBox {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
