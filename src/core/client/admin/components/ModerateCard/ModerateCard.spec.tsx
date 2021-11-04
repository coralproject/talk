import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import ModerateCard from "./ModerateCard";

const ModerateCardN = removeFragmentRefs(ModerateCard);

const baseProps: PropTypesOf<typeof ModerateCardN> = {
  id: "comment-id",
  username: "Theon",
  createdAt: "2018-11-29T16:01:51.897Z",
  body: "content",
  edited: false,
  inReplyTo: null,
  settings: {},
  comment: {},
  status: "undecided",
  featured: false,
  viewContextHref: "http://localhost/comment",
  siteName: null,
  onApprove: noop,
  onReject: noop,
  onFeature: noop,
  onBan: noop,
  onUsernameClick: noop,
  onFocusOrClick: noop,
  onConversationClick: noop,
  showStory: false,
  moderatedBy: null,
};

it("renders correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
  };
  const renderer = createRenderer();
  renderer.render(<ModerateCardN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders reply correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    inReplyTo: {
      username: "Julian",
      id: "1234",
    },
  };
  const renderer = createRenderer();
  renderer.render(<ModerateCardN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders approved correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    status: "approved",
  };
  const renderer = createRenderer();
  renderer.render(<ModerateCardN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders rejected correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    status: "rejected",
  };
  const renderer = createRenderer();
  renderer.render(<ModerateCardN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders dangling correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    dangling: true,
  };
  const renderer = createRenderer();
  renderer.render(<ModerateCardN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders story info", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    showStory: true,
    storyTitle: "Cancer cured!",
    storyHref: "/story",
    onModerateStory: noop,
  };
  const renderer = createRenderer();
  renderer.render(<ModerateCardN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders tombstoned when comment is deleted", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    deleted: true,
  };
  const renderer = createRenderer();
  renderer.render(<ModerateCardN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
