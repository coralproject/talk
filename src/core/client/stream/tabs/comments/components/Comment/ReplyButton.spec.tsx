import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import ReplyButton from "./ReplyButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyButton> = {
    id: "id",
    onClick: noop,
    active: true,
  };
  const renderer = createRenderer();
  renderer.render(<ReplyButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
