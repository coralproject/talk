import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import RTE from "./RTE";

it("renders correctly", () => {
  const props: PropTypesOf<typeof RTE> = {
    className: "custom",
    placeholder: "Post a comment",
    value: "Hello world",
  };
  const renderer = createRenderer();
  renderer.render(<RTE {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
