import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import { CommentContainer } from "./CommentContainer";

// Remove relay refs so we can stub the props.
const CommentContainerN = removeFragmentRefs(CommentContainer);

it("renders username and body", () => {
  const props: PropTypesOf<typeof CommentContainerN> = {
    me: null,
    story: {
      url: "http://localhost/story",
    },
    comment: {
      id: "comment-id",
      author: {
        id: "author-id",
        username: "Marvin",
      },
      parent: null,
      body: "Woof",
      createdAt: "1995-12-17T03:24:00.000Z",
      editing: {
        edited: false,
        editableUntil: "1995-12-17T03:24:30.000Z",
      },
      pending: false,
    },
    settings: {
      reaction: {
        icon: "thumb_up_alt",
        label: "Respect",
      },
    },
    indentLevel: 1,
    showAuthPopup: noop as any,
    setCommentID: noop as any,
    localReply: false,
    disableReplies: false,
  };

  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders body only", () => {
  const props: PropTypesOf<typeof CommentContainerN> = {
    me: null,
    story: {
      url: "http://localhost/story",
    },
    comment: {
      id: "comment-id",
      author: {
        id: "author-id",
        username: null,
      },
      parent: null,
      body: "Woof",
      createdAt: "1995-12-17T03:24:00.000Z",
      editing: {
        edited: false,
        editableUntil: "1995-12-17T03:24:30.000Z",
      },
      pending: false,
    },
    settings: {
      reaction: {
        icon: "thumb_up_alt",
        label: "Respect",
      },
    },
    indentLevel: 1,
    showAuthPopup: noop as any,
    setCommentID: noop as any,
  };

  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("hide reply button", () => {
  const props: PropTypesOf<typeof CommentContainerN> = {
    me: null,
    story: {
      url: "http://localhost/story",
    },
    comment: {
      id: "comment-id",
      author: {
        id: "author-id",
        username: "Marvin",
      },
      parent: null,
      body: "Woof",
      createdAt: "1995-12-17T03:24:00.000Z",
      editing: {
        edited: false,
        editableUntil: "1995-12-17T03:24:30.000Z",
      },
      pending: false,
    },
    settings: {
      reaction: {
        icon: "thumb_up_alt",
        label: "Respect",
      },
    },
    indentLevel: 1,
    showAuthPopup: noop as any,
    setCommentID: noop as any,
    localReply: false,
    disableReplies: true,
  };

  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("shows conversation link", () => {
  const props: PropTypesOf<typeof CommentContainerN> = {
    me: null,
    story: {
      url: "http://localhost/story",
    },
    settings: {
      reaction: {
        icon: "thumb_up",
        label: "Respect",
        labelActive: "Respected",
      },
    },
    comment: {
      id: "comment-id",
      author: {
        id: "author-id",
        username: "Marvin",
      },
      parent: null,
      body: "Woof",
      createdAt: "1995-12-17T03:24:00.000Z",
      editing: {
        edited: false,
        editableUntil: "1995-12-17T03:24:30.000Z",
      },
      pending: false,
    },
    indentLevel: 1,
    showAuthPopup: noop as any,
    setCommentID: noop as any,
    localReply: false,
    disableReplies: false,
    showConversationLink: true,
  };

  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders in reply to", () => {
  const props: PropTypesOf<typeof CommentContainerN> = {
    me: null,
    story: {
      url: "http://localhost/story",
    },
    comment: {
      id: "comment-id",
      author: {
        id: "author-id",
        username: "Marvin",
      },
      parent: {
        author: {
          username: "ParentAuthor",
        },
      },
      body: "Woof",
      createdAt: "1995-12-17T03:24:00.000Z",
      editing: {
        edited: false,
        editableUntil: "1995-12-17T03:24:30.000Z",
      },
      pending: false,
    },
    settings: {
      reaction: {
        icon: "thumb_up_alt",
        label: "Respect",
      },
    },
    indentLevel: 1,
    showAuthPopup: noop as any,
    setCommentID: noop as any,
    localReply: false,
    disableReplies: false,
  };

  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
