import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import IndentedComment from "./IndentedComment";

it("renders correctly", () => {
  const props: PropTypesOf<typeof IndentedComment> = {
    indentLevel: 1,
    username: "Marvin",
    body: "Woof",
    createdAt: "1995-12-17T03:24:00.000Z",
  };
  const renderer = createRenderer();
  renderer.render(<IndentedComment {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
