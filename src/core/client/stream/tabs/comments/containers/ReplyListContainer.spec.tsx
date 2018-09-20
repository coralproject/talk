import { shallow, ShallowWrapper } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import ReplyList from "../components/ReplyList";
import { ReplyListContainer } from "./ReplyListContainer";

// Remove relay refs so we can stub the props.
const ReplyListContainerN = removeFragmentRefs(ReplyListContainer);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
      replies: {
        edges: [{ node: { id: "comment-1" } }, { node: { id: "comment-2" } }],
      },
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    } as any,
    me: null,
    indentLevel: 1,
    ReplyListComponent: () => null,
  };
  const wrapper = shallow(<ReplyListContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when replies are null", () => {
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
      replies: null,
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    } as any,
    me: null,
    indentLevel: 1,
    ReplyListComponent: undefined,
  };
  const wrapper = shallow(<ReplyListContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when has more replies", () => {
  let finishLoading: ((error?: Error) => void) | null = null;
  const props: PropTypesOf<typeof ReplyListContainerN> = {
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
      replies: {
        edges: [{ node: { id: "comment-1" } }, { node: { id: "comment-2" } }],
      },
    },
    relay: {
      hasMore: () => true,
      isLoading: () => false,
      loadMore: (_: any, callback: () => void) => (finishLoading = callback),
    } as any,
    me: null,
    indentLevel: 1,
    ReplyListComponent: undefined,
  };

  let wrapper: ShallowWrapper;

  beforeAll(() => (wrapper = shallow(<ReplyListContainerN {...props} />)));

  it("renders hasMore", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("when showing all", () => {
    beforeAll(() => {
      wrapper
        .find(ReplyList)
        .props()
        .onShowAll();
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
