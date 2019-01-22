import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import Moderation from "./Moderation";

const ModerationN = removeFragmentRefs(Moderation);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ModerationN> = {
    disabled: false,
    settings: {},
    onInitValues: noop,
  };
  const renderer = createRenderer();
  renderer.render(<ModerationN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
