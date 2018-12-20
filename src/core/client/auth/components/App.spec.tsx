import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import App from "./App";

const AppN = removeFragmentRefs(App);

it("renders sign in", () => {
  const props: PropTypesOf<typeof AppN> = {
    view: "SIGN_IN",
    auth: {},
  };
  const renderer = createRenderer();
  renderer.render(<AppN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
