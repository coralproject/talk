import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";

import PostCommentFormFake from "./PostCommentFormFake";

const PostCommentFormFakeN = removeFragmentRefs(PostCommentFormFake);

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(
    <PostCommentFormFakeN
      rteConfig={{}}
      story={{}}
      draft=""
      onDraftChange={noop}
      onSignIn={noop}
      showMessageBox
    />
  );
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
