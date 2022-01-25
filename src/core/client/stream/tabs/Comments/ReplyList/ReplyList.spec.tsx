import { shallow } from "enzyme";
import React from "react";
import { Environment, RecordSource } from "relay-runtime";
import sinon, { SinonSpy } from "sinon";

import {
  createRelayEnvironment,
  removeFragmentRefs,
} from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";
import { initLocalState } from "coral-stream/local";

import ReplyList from "./ReplyList";

let environment: Environment;
let source: RecordSource;

const context = {
  localStorage: window.localStorage,
  sessionStorage: window.sessionStorage,
  window,
  renderWindow: window,
};

beforeEach(() => {
  source = new RecordSource();
  environment = createRelayEnvironment({
    source,
    initLocalState: false,
  });
});

const ReplyListN = removeFragmentRefs(ReplyList);

// TODO (Nick): This will need to be rewritten with a full testRenderer as an
//   integration test for this to work. We can't do shallow and have ReplyList
//   use local lookups.
//
// it("renders correctly", async () => {
//   await initLocalState({ environment, context: context as any });
//   const props: PropTypesOf<typeof ReplyListN> = {
//     story: { id: "story-id" },
//     comment: { id: "comment-id" },
//     comments: [
//       { id: "comment-1" },
//       { id: "comment-2", showConversationLink: true },
//     ],
//     onShowAll: noop,
//     hasMore: false,
//     disableShowAll: false,
//     indentLevel: 1,
//     viewer: null,
//     localReply: false,
//     disableReplies: false,
//     settings: {
//       reaction: {
//         icon: "thumb_up_alt",
//         label: "Respect",
//       },
//     },
//   };
//   const wrapper = shallow(<ReplyListN {...props} />);
//   expect(wrapper).toMatchSnapshot();
// });

describe("when there is more", async () => {
  await initLocalState({ environment, context: context as any });
  const props: PropTypesOf<typeof ReplyListN> = {
    story: { id: "story-id" },
    comment: { id: "comment-id" },
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onShowAll: sinon.spy(),
    hasMore: true,
    disableShowAll: false,
    indentLevel: 1,
    viewer: null,
    settings: {
      reaction: {
        icon: "thumb_up_alt",
        label: "Respect",
      },
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
