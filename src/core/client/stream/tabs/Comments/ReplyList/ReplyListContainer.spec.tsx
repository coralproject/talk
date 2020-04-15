import { shallow, ShallowWrapper } from "enzyme";
import { EventEmitter2 } from "eventemitter2";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import ReplyList from "./ReplyList";
import { ReplyListContainer } from "./ReplyListContainer";

// Remove relay refs so we can stub the props.
const ReplyListContainerN = removeFragmentRefs(ReplyListContainer);

/* Mock useContext */
const context = { eventEmitter: new EventEmitter2() };
jest.spyOn(React, "useContext").mockImplementation(() => context);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    story: {
      isClosed: false,
      settings: { live: { enabled: true } },
    },
    comment: {
      id: "comment-id",
      status: "NONE",
      replies: {
        edges: [
          { node: { id: "comment-1", enteredLive: false } },
          { node: { id: "comment-2", enteredLive: false } },
        ],
        viewNewEdges: [],
      },
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
    ReplyListComponent: () => null,
    localReply: false,
  };
  const wrapper = shallow(<ReplyListContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when replies are empty", () => {
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    story: {
      isClosed: false,
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
    ReplyListComponent: undefined,
    localReply: false,
  };
  const wrapper = shallow(<ReplyListContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when has more replies", () => {
  let finishLoading: ((error?: Error) => void) | null = null;
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    story: {
      isClosed: false,
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
          { node: { id: "comment-1", enteredLive: false } },
          { node: { id: "comment-2", enteredLive: false } },
        ],
        viewNewEdges: [],
      },
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
    ReplyListComponent: undefined,
    localReply: false,
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
