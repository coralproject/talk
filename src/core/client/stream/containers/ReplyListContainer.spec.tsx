import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { ReplyListContainer } from "./ReplyListContainer";

it("renders correctly", () => {
  const props: any = {
    comment: {
      id: "comment-id",
      replies: {
        edges: [{ node: { id: "comment-1" } }, { node: { id: "comment-2" } }],
      },
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    },
  };
  const wrapper = shallow(<ReplyListContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when replies are null", () => {
  const props: any = {
    comment: {
      id: "comment-id",
      replies: null,
    },
    relay: {
      hasMore: noop,
      isLoading: noop,
    },
  };
  const wrapper = shallow(<ReplyListContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});
