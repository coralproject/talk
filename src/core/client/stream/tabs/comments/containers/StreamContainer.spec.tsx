import { shallow, ShallowWrapper } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import Stream from "../components/Stream";
import { StreamContainer } from "./StreamContainer";

// Remove relay refs so we can stub the props.
const StreamContainerN = removeFragmentRefs(StreamContainer);

it("renders correctly", () => {
  const props: PropTypesOf<typeof StreamContainerN> = {
    asset: {
      id: "asset-id",
      isClosed: false,
      comments: {
        edges: [{ node: { id: "comment-1" } }, { node: { id: "comment-2" } }],
      },
    },
    me: null,
    settings: {
      reaction: {
        icon: "thumb_up_alt",
        label: "Respect",
      },
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    } as any,
    defaultOrderBy: "CREATED_AT_ASC",
  };
  const wrapper = shallow(<StreamContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when has more comments", () => {
  let finishLoading: ((error?: Error) => void) | null = null;
  const props: PropTypesOf<typeof StreamContainerN> = {
    asset: {
      id: "asset-id",
      isClosed: false,
      comments: {
        edges: [{ node: { id: "comment-1" } }, { node: { id: "comment-2" } }],
      },
    },
    me: null,
    settings: {
      reaction: {
        icon: "thumb_up_alt",
        label: "Respect",
      },
    },
    relay: {
      hasMore: () => true,
      isLoading: () => false,
      loadMore: (_: any, callback: () => void) => (finishLoading = callback),
    } as any,
    defaultOrderBy: "CREATED_AT_ASC",
  };

  let wrapper: ShallowWrapper;

  beforeAll(() => (wrapper = shallow(<StreamContainerN {...props} />)));

  it("renders hasMore", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("when loading more", () => {
    beforeAll(() => {
      wrapper
        .find(Stream)
        .props()
        .onLoadMore();
    });
    it("calls relay loadMore", () => {
      expect(finishLoading).not.toBeNull();
    });
    it("disables load more button", () => {
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
    it("enable load more button after loading is done", () => {
      finishLoading!();
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
