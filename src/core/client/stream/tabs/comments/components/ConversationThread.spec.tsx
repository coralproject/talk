import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import ConversationThread from "./ConversationThread";

const ConversationThreadN = removeFragmentRefs(ConversationThread);

describe("with 2 remaining parent comments", () => {
  it("renders correctly", () => {
    const props: PropTypesOf<typeof ConversationThreadN> = {
      className: "root",
      me: {},
      asset: {},
      settings: {},
      comment: {},
      disableLoadMore: false,
      loadMore: noop,
      remaining: 2,
      parents: [],
      rootParent: {
        id: "root-parent",
        createdAt: "1995-12-17T03:24:00.000Z",
        username: "parentAuthor",
      },
    };
    const wrapper = shallow(<ConversationThreadN {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it("renders with disabled load more", () => {
    const props: PropTypesOf<typeof ConversationThreadN> = {
      className: "root",
      me: {},
      asset: {},
      settings: {},
      comment: {},
      disableLoadMore: true,
      loadMore: noop,
      remaining: 2,
      parents: [],
      rootParent: {
        id: "root-parent",
        createdAt: "1995-12-17T03:24:00.000Z",
        username: "parentAuthor",
      },
    };
    const wrapper = shallow(<ConversationThreadN {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

it("renders with no parent comments", () => {
  const props: PropTypesOf<typeof ConversationThreadN> = {
    className: "root",
    me: {},
    asset: {},
    settings: {},
    comment: {},
    disableLoadMore: false,
    loadMore: noop,
    remaining: 0,
    parents: [],
    rootParent: null,
  };
  const wrapper = shallow(<ConversationThreadN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
