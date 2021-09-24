import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import CommentContent from "./CommentContent";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    bannedWords: [{ value: "bad", index: 15, length: 3 }],
    suspectWords: [],
    className: "custom",
    children: "Hello Bob, you bad guy",
    highlight: true,
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders empty words correctly", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    bannedWords: [],
    suspectWords: [],
    className: "custom",
    children: "Hello <b>Bob</b>, you bad guy",
    highlight: true,
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly even if it has consecutive banned words on comments", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    bannedWords: [
      { value: "bad", index: 33, length: 3 },
      { value: "bad", index: 54, length: 3 },
      { value: "bad", index: 62, length: 3 },
      { value: "bad", index: 71, length: 3 },
      { value: "bad", index: 75, length: 3 },
      { value: "bad", index: 88, length: 3 },
    ],
    suspectWords: [],
    className: "custom",
    children:
      "This is a very long comment with bad words. Let's try bad and bad. Now bad bad.\nBad BAD bad.\n",
    highlight: true,
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
