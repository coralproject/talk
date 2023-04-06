/*
TODO: (cvle) We don't do unit tests for non-presentational components anymore.
      Should move these into an integration test.

import { EventEmitter2 } from "eventemitter2";
import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { pureMerge } from "coral-common/utils";
import { removeFragmentRefs } from "coral-framework/testHelpers";
import { DeepPartial, PropTypesOf } from "coral-framework/types";

import { CommentContainer } from "./CommentContainer";

// Remove relay refs so we can stub the props.
const CommentContainerN = removeFragmentRefs(CommentContainer);

type Props = PropTypesOf<typeof CommentContainerN>;

function createDefaultProps(add: DeepPartial<Props> = {}): Props {
  return pureMerge(
    {
      eventEmitter: new EventEmitter2(),
      viewer: null,
      story: {
        id: "story-0",
        url: "http://localhost/story",
        isClosed: false,
        isArchived: false,
        isArchiving: false,
        canModerate: false,
        settings: {
          mode: "COMMENTS",
        },
      },
      comment: {
        id: "comment-id",
        status: "NONE",
        author: {
          id: "author-id",
          username: "Marvin",
          badges: [],
          avatar: null,
        },
        actionCounts: {
          reaction: {
            total: 0,
          },
        },
        parent: null,
        body: "Woof",
        createdAt: "1995-12-17T03:24:00.000Z",
        editing: {
          edited: false,
          editableUntil: "1995-12-17T03:24:30.000Z",
        },
        rating: null,
        pending: false,
        tags: [],
        lastViewerAction: null,
        deleted: false,
        viewerActionPresence: {
          dontAgree: false,
          flag: false,
        },
        hasTraversalFocus: false,
      },
      settings: {
        flattenReplies: false,
        disableCommenting: {
          enabled: false,
        },
        featureFlags: [],
      },
      indentLevel: 1,
      showAuthPopup: noop as any,
      setCommentID: noop as any,
      localReply: false,
      disableReplies: false,
      onRemoveAnswered: undefined,
      collapsed: undefined,
      toggleCollapsed: noop as any,
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

it("renders with tombstone when comment has been deleted", () => {
  const props = createDefaultProps({
    comment: {
      deleted: true,
    },
  });
  const renderer = createRenderer();
  renderer.render(<CommentContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
*/
it("dummy", () => {});
