import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import ModerationConfig from "./ModerationConfig";

const ModerationConfigN = removeFragmentRefs(ModerationConfig);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ModerationConfigN> = {
    disabled: false,
    settings: {},
    onInitValues: noop,
  };
  const renderer = createRenderer();
  renderer.render(<ModerationConfigN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
