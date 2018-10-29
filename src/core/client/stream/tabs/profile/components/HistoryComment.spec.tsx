import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import HistoryComment from "./HistoryComment";

const HistoryCommentN = removeFragmentRefs(HistoryComment);

it("renders correctly", () => {
  const props: PropTypesOf<typeof HistoryCommentN> = {
    body: "Hello World",
    createdAt: "2018-07-06T18:24:00.000Z",
    replyCount: 4,
    story: {
      title: "Story Title",
    },
    conversationURL: "http://localhost/conversation",
    onGotoConversation: noop,
  };
  const wrapper = shallow(<HistoryCommentN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
