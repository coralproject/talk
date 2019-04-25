import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import Moderate from "./Moderate";

const ModerateN = removeFragmentRefs(Moderate);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ModerateN> = {
    allStories: true,
    moderationQueues: {},
    story: {},
  };
  const renderer = createRenderer();
  renderer.render(<ModerateN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
