import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import { removeFragmentRefs } from "talk-framework/testHelpers";

import { PropTypesOf } from "talk-framework/types";

import App from "./App";

const AppN = removeFragmentRefs(App);

it("renders correctly", () => {
  const props: PropTypesOf<typeof AppN> = {
    me: {},
    children: "child",
  };
  const renderer = createRenderer();

  renderer.render(<AppN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
