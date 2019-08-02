import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import App from "./App";

const AppN = removeFragmentRefs(App);

it("renders sign in", () => {
  const props: PropTypesOf<typeof AppN> = {
    view: "SIGN_IN",
    auth: {},
    viewer: null,
  };
  const renderer = createRenderer();
  renderer.render(<AppN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
