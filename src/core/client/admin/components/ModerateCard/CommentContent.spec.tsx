import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import CommentContent from "./CommentContent";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    suspectWords: ["worse"],
    bannedWords: ["bad"],
    className: "custom",
    children: "Hello <b>Bob</b>, you bad guy",
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
    children: "Hello <b>Bob</b>, you bad guy",
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
