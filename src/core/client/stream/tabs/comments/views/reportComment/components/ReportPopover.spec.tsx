import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import ReportPopover from "./ReportPopover";

const ReportPopoverN = removeFragmentRefs(ReportPopover);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReportPopoverN> = {
    comment: {},
    onClose: noop,
    onResize: noop,
  };
  const renderer = createRenderer();
  renderer.render(<ReportPopoverN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
