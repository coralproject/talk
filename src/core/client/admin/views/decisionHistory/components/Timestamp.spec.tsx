import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import Timestamp from "./Timestamp";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Timestamp> = {
    children: "2018-07-06T18:24:00.000Z",
  };
  const renderer = createRenderer();
  renderer.render(<Timestamp {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
