import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import OIDCButton from "./OIDCButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof OIDCButton> = {
    onClick: noop,
    children: "Login with OIDC",
  };
  const renderer = createRenderer();
  renderer.render(<OIDCButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
