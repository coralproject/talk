import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import SingleModerate from "./SingleModerate";

it("renders correctly", () => {
  const props: PropTypesOf<typeof SingleModerate> = {
    children: "singe comment queue",
  };
  const renderer = createRenderer();
  renderer.render(<SingleModerate {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
