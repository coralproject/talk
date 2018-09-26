import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import { CommentContainer } from "./CommentContainer";

// Remove relay refs so we can stub the props.
const CommentContainerN = removeFragmentRefs(CommentContainer);

it("renders username and body", () => {
  const props: PropTypesOf<typeof CommentContainerN> = {
    me: null,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
      author: {
        id: "author-id",
        username: "Marvin",
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
    localReply: false,
    disableReplies: false,
  };

  const wrapper = shallow(<CommentContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders body only", () => {
  const props: PropTypesOf<typeof CommentContainerN> = {
    me: null,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
      author: {
        id: "author-id",
        username: null,
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
  };

  const wrapper = shallow(<CommentContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("hide reply button", () => {
  const props: PropTypesOf<typeof CommentContainerN> = {
    me: null,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
      author: {
        id: "author-id",
        username: "Marvin",
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
    localReply: false,
    disableReplies: true,
  };

  const wrapper = shallow(<CommentContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
