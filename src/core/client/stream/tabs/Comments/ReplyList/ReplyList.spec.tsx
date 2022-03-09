import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import { RecordSource } from "relay-runtime";
import sinon, { SinonSpy } from "sinon";

import {
  createRelayEnvironment,
  removeFragmentRefs,
} from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import ReplyList from "./ReplyList";

const source = new RecordSource();

const context = {
  localStorage: window.localStorage,
  sessionStorage: window.sessionStorage,
  window,
  renderWindow: window,
  relayEnvironment: createRelayEnvironment({
    source,
    initLocalState: true,
  }),
};

const ReplyListN = removeFragmentRefs(ReplyList);
jest.spyOn(React, "useContext").mockImplementation(() => context);

it("renders correctly", async () => {
  const props: PropTypesOf<typeof ReplyListN> = {
    story: { " $data": { id: "story-id" } },
    comment: { id: "comment-id" },
    comments: [
      { id: "comment-1" },
      { id: "comment-2", showConversationLink: true },
    ],
    onShowAll: noop,
    hasMore: false,
    disableShowAll: false,
    indentLevel: 1,
    viewer: null,
    localReply: false,
    disableReplies: false,
    settings: {
      " $data": {
        featureFlags: [],
        flattenReplies: false,
        // reaction: {
        //   icon: "thumb_up_alt",
        //   label: "Respect",
        // },
      },
    },
  };
  const wrapper = shallow(<ReplyListN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when there is more", async () => {
  const props: PropTypesOf<typeof ReplyListN> = {
    story: { " $data": { id: "story-id" } },
    comment: { id: "comment-id" },
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onShowAll: sinon.spy(),
    hasMore: true,
    disableShowAll: false,
    indentLevel: 1,
    viewer: null,
    settings: {
      " $data": {
        featureFlags: [],
        flattenReplies: false,
      },
      // reaction: {
      //   icon: "thumb_up_alt",
      //   label: "Respect",
      // },
    },
  };

  const wrapper = shallow(<ReplyListN {...props} />);
  it("renders a load more button", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("calls onLoadMore", () => {
    wrapper
      .find("#coral-comments-replyList-showAll--comment-id")
      .simulate("click");
    expect((props.onShowAll as SinonSpy).calledOnce).toBe(true);
  });

  const wrapperDisabledButton = shallow(
    <ReplyListN {...props} disableShowAll />
  );
  it("disables load more button", () => {
    expect(wrapperDisabledButton).toMatchSnapshot();
  });
});
