import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import ModerateCard from "./ModerateCard";

const ModerateCardN = removeFragmentRefs(ModerateCard);

const baseProps: PropTypesOf<typeof ModerateCardN> = {
  id: "comment-id",
  username: "Theon",
  createdAt: "2018-11-29T16:01:51.897Z",
  body: "content",
  inReplyTo: null,
  comment: {},
  status: "undecided",
  viewContextHref: "http://localhost/comment",
  suspectWords: ["idiot"],
  bannedWords: ["fuck"],
  onAccept: noop,
  onReject: noop,
  showStory: false,
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
    inReplyTo: "Julian",
  };
  const renderer = createRenderer();
  renderer.render(<ModerateCardN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders accepted correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    status: "accepted",
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
