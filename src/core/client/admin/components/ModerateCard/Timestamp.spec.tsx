import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Timestamp from "./Timestamp";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Timestamp> = {
    children: "1995-12-17T03:24:00.000Z",
  };
  const renderer = createRenderer();
  renderer.render(<Timestamp {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
