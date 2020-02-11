import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import Moderate from "./Moderate";

const ModerateN = removeFragmentRefs(Moderate);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ModerateN> = {
    allStories: true,
    moderationQueues: {},
    story: {},
    site: null,
    query: "",
    routeParams: {},
    queueName: "",
  };
  const renderer = createRenderer();
  renderer.render(<ModerateN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
