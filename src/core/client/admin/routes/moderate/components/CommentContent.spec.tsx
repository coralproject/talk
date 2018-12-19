import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import CommentContent from "./CommentContent";

import { PropTypesOf } from "talk-framework/types";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    suspectWords: ["idiot", "damn"],
    bannedWords: ["fuck", "fucking"],
    className: "custom",
    children: "Hello <strong>idiot</strong>, you fucking bastard",
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders empty words correctly", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    suspectWords: [],
    bannedWords: [],
    className: "custom",
    children: "Hello <strong>idiot</strong>, you fucking bastard",
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
