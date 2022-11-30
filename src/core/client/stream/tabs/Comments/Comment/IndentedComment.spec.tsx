import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import IndentedComment from "./IndentedComment";

it("renders correctly", () => {
  const props: PropTypesOf<typeof IndentedComment> = {
    id: "comment-0",
    showCommentID: false,
    indentLevel: 1,
    username: "Marvin",
    usernameEl: <span>Marvin</span>,
    staticUsername: "Marvin",
    body: "Woof",
    staticTopBarRight: "",
    createdAt: "1995-12-17T03:24:00.000Z",
    parent: {
      id: "test-id",
      author: {
        username: "test-user",
      },
    },
  };
  const renderer = createRenderer();
  renderer.render(<IndentedComment {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
