import { removeFragmentRefs } from "coral-framework/testHelpers";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import App from "./App";

const AppN = removeFragmentRefs(App);

it("renders correctly", () => {
  const props: PropTypesOf<typeof AppN> = {
    viewer: {},
    children: "child",
  };
  const renderer = createRenderer();

  renderer.render(<AppN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
