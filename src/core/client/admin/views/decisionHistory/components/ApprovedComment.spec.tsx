import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import ApprovedComment from "./ApprovedComment";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ApprovedComment> = {
    href: "#",
    username: "InTheExpensiveSeats",
    date: "2018-07-06T18:24:00.000Z",
    onGotoComment: noop,
  };
  const renderer = createRenderer();
  renderer.render(<ApprovedComment {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
