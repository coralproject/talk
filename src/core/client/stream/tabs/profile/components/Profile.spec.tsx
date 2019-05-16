import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import Profile from "./Profile";

const ProfileN = removeFragmentRefs(Profile);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ProfileN> = {
    story: {},
    viewer: {},
    settings: {},
  };
  const renderer = createRenderer();
  renderer.render(<ProfileN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
