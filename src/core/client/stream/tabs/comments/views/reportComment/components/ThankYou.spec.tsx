import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import ThankYou from "./ThankYou";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ThankYou> = {
    onDismiss: noop,
  };
  const renderer = createRenderer();
  renderer.render(<ThankYou {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
