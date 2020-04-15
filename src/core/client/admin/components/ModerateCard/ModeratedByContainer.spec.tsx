import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import ModeratedByContainer from "./ModeratedByContainer";

const ModeratedByContainerN = removeFragmentRefs(ModeratedByContainer);

it("viewer's username shows on moderation cards moderated by viewer", () => {
  const props: PropTypesOf<typeof ModeratedByContainerN> = {
    comment: {
      id: "comment-id",
      statusLiveUpdated: false,
      statusHistory: {
        edges: [
          {
            moderator: {
              id: "viewer",
              username: "viewer",
            },
          },
        ],
      },
    },
    onUsernameClicked: (id?: string | null) => {
      return;
    },
  };

  const renderer = createRenderer();
  renderer.render(<ModeratedByContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
