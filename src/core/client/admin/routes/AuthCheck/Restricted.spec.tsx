import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Restricted from "./Restricted";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Restricted> = {
    username: "User",
    onSignInAs: noop,
  };
  const renderer = createRenderer();

  renderer.render(<Restricted {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
