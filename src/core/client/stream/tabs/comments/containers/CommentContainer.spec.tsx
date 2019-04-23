import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { pureMerge } from "talk-common/utils";
import { removeFragmentRefs } from "talk-framework/testHelpers";
import { DeepPartial, PropTypesOf } from "talk-framework/types";

import { CommentContainer } from "./CommentContainer";

// Remove relay refs so we can stub the props.
const CommentContainerN = removeFragmentRefs(CommentContainer);

type Props = PropTypesOf<typeof CommentContainerN>;

function createDefaultProps(add: DeepPartial<Props> = {}): Props {
  return pureMerge(
    {
      viewer: null,
      story: {
        url: "http://localhost/story",
        isClosed: false,
      },
      comment: {
        id: "comment-id",
        status: "NONE",
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
        tags: [],
      },
      settings: {
        disableCommenting: {
          enabled: false,
        },
      },
      indentLevel: 1,
      showAuthPopup: noop as any,
      setCommentID: noop as any,
      localReply: false,
      disableReplies: false,
    },
    add
  );
}

it("renders username and body", () => {
  const props = createDefaultProps();
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders body only", () => {
  const props = createDefaultProps({
    comment: {
      author: {
        username: null,
      },
    },
  });
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("hide reply button", () => {
  const props = createDefaultProps({
    disableReplies: true,
  });
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("shows conversation link", () => {
  const props = createDefaultProps({
    showConversationLink: true,
  });
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders in reply to", () => {
  const props = createDefaultProps({
    comment: {
      parent: {
        author: {
          username: "ParentAuthor",
        },
      },
    },
  });
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders disabled reply when story is closed", () => {
  const props = createDefaultProps({
    story: {
      isClosed: true,
    },
  });
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders disabled reply when commenting has been disabled", () => {
  const props = createDefaultProps({
    settings: {
      disableCommenting: {
        enabled: true,
      },
    },
  });
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders staff badge", () => {
  const props = createDefaultProps({
    comment: {
      tags: [{ name: "Staff" }],
    },
  });
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
