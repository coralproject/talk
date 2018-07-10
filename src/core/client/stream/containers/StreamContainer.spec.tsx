import { shallow, ShallowWrapper } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Stream from "../components/Stream";
import { StreamContainer } from "./StreamContainer";

it("renders correctly", () => {
  const props: PropTypesOf<StreamContainer> = {
    asset: {
      id: "asset-id",
      isClosed: false,
      comments: {
        edges: [{ node: { id: "comment-1" } }, { node: { id: "comment-2" } }],
      },
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    } as any,
  };
  const wrapper = shallow(<StreamContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when has more comments", () => {
  let finishLoading: ((error?: Error) => void) | null = null;
  const props: PropTypesOf<StreamContainer> = {
    asset: {
      id: "asset-id",
      isClosed: false,
      comments: {
        edges: [{ node: { id: "comment-1" } }, { node: { id: "comment-2" } }],
      },
    },
    relay: {
      hasMore: () => true,
      isLoading: () => false,
      loadMore: (_: any, callback: () => void) => (finishLoading = callback),
    } as any,
  };

  let wrapper: ShallowWrapper;

  beforeAll(() => (wrapper = shallow(<StreamContainer {...props} />)));

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
