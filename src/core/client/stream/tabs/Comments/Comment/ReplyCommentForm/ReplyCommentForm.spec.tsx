import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import ReplyCommentForm from "./ReplyCommentForm";

const ReplyCommentFormN = removeFragmentRefs(ReplyCommentForm);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyCommentFormN> = {
    id: "reply-0",
    siteID: "site-0",
    onSubmit: noop as any,
    onCancel: noop as any,
    onChange: noop as any,
    parentUsername: "parent-user-0",
    min: 3,
    max: 500,
    disabled: false,
  };

  const renderer = createRenderer();
  renderer.render(<ReplyCommentFormN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
