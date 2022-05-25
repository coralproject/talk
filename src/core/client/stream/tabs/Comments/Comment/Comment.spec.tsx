import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Comment from "./Comment";

it("renders username and body", () => {
  const props: PropTypesOf<typeof Comment> = {
    username: "Marvin",
    tags: "",
    badges: "",
    body: "Woof",
    createdAt: "1995-12-17T03:24:00.000Z",
    topBarRight: "topBarRight",
    footer: "footer",
    showEditedMarker: true,
    parent: {
      id: "test-id",
      author: {
        username: "test-user",
      },
    },
    id: "comment-0",
    showCommentID: false,
  };
  const renderer = createRenderer();
  renderer.render(<Comment {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
