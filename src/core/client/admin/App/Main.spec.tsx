import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import Main from "./Main";

const MainN = removeFragmentRefs(Main);

it("renders correctly", () => {
  const props: PropTypesOf<typeof MainN> = {
    viewer: {},
    children: "child",
  };
  const renderer = createRenderer();

  renderer.render(<MainN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
