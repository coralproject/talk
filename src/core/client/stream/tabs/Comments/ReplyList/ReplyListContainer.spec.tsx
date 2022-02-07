import { shallow, ShallowWrapper } from "enzyme";
import { EventEmitter2 } from "eventemitter2";
import { noop } from "lodash";
import React from "react";

import {
  createRelayEnvironment,
  removeFragmentRefs,
} from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import ReplyList from "./ReplyList";
import { ReplyListContainer } from "./ReplyListContainer";

// Remove relay refs so we can stub the props.
const ReplyListContainerN = removeFragmentRefs(ReplyListContainer);
/* Mock useContext */
const context = {
  eventEmitter: new EventEmitter2(),
  relayEnvironment: createRelayEnvironment({}),
};
jest.spyOn(React, "useContext").mockImplementation(() => context);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    story: {
      id: "story-id",
      closedAt: null,
      isClosed: false,
      settings: { live: { enabled: true } },
    },
    comment: {
      id: "comment-id",
      status: "NONE",
      replies: {
        edges: [
          { node: { id: "comment-1", replyCount: 0 } },
          { node: { id: "comment-2", replyCount: 0 } },
        ],
        viewNewEdges: [],
      },
      pending: null,
      lastViewerAction: null,
    },
    settings: {
      disableCommenting: {
        enabled: false,
      },
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    } as any,
    viewer: null,
    indentLevel: 1,
    NextReplyListComponent: () => null,
    flattenReplies: false,
  };
  const wrapper = shallow(<ReplyListContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when replies are empty", () => {
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    story: {
      id: "story-id",
      isClosed: false,
      closedAt: null,
      settings: {
        live: {
          enabled: true,
        },
      },
    },
    comment: {
      id: "comment-id",
      status: "NONE",
      replies: { edges: [], viewNewEdges: [] },
      pending: null,
      lastViewerAction: null,
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    } as any,
    viewer: null,
    settings: {
      disableCommenting: {
        enabled: false,
      },
    },
    indentLevel: 1,
    NextReplyListComponent: null,
    flattenReplies: false,
  };
  const wrapper = shallow(<ReplyListContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when has more replies", () => {
  let finishLoading: ((error?: Error) => void) | null = null;
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    story: {
      id: "story-id",
      isClosed: false,
      closedAt: null,
      settings: {
        live: {
          enabled: true,
        },
      },
    },
    comment: {
      id: "comment-id",
      status: "NONE",
      replies: {
        edges: [
          { node: { id: "comment-1", replyCount: 0 } },
          { node: { id: "comment-2", replyCount: 0 } },
        ],
        viewNewEdges: [],
      },
      pending: null,
      lastViewerAction: null,
    },
    settings: {
      disableCommenting: {
        enabled: false,
      },
    },
    relay: {
      hasMore: () => true,
      isLoading: () => false,
      loadMore: (_: any, callback: () => void) => (finishLoading = callback),
    } as any,
    viewer: null,
    indentLevel: 1,
    NextReplyListComponent: null,
    flattenReplies: false,
  };

  let wrapper: ShallowWrapper<any>;

  beforeAll(() => (wrapper = shallow(<ReplyListContainerN {...props} />)));

  it("renders hasMore", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("when showing all", () => {
    beforeAll(() => {
      const replyList = wrapper.find(ReplyList);
      if (replyList) {
        wrapper.props().onShowAll();
      }
    });
    it("calls relay loadMore", () => {
      expect(finishLoading).not.toBeNull();
    });
    it("disables show all button", () => {
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
    it("enable show all button after loading is done", () => {
      finishLoading!();
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
