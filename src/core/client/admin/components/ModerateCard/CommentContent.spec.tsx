import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import CommentContent from "./CommentContent";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    phrases: {
      locale: "en-US",
      wordList: {
        suspect: ["worse"],
        banned: ["bad"],
      },
    },
    className: "custom",
    children: "Hello <b>Bob</b>, you bad guy",
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders empty words correctly", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    phrases: {
      locale: "en-US",
      wordList: {
        suspect: [],
        banned: [],
      },
    },
    className: "custom",
    children: "Hello <b>Bob</b>, you bad guy",
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly in Brazilian Portuguese: it doesn't treat accented characters as word separators", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    phrases: {
      locale: "pt-BR",
      wordList: {
        suspect: ["anual"],
        banned: ["bi", "ESTRANHO"],
      },
    },
    className: "custom",
    children: "O biólogo analisou o caso.bi Mas não foi ao evento biánual",
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders empty words correctly in Brazilian Portuguese", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    phrases: {
      locale: "pt-BR",
      wordList: {
        suspect: [],
        banned: [],
      },
    },
    className: "custom",
    children: "Olá <b>Bob</b>, você é um cara mau",
  };
  const renderer = createRenderer();
  renderer.render(<CommentContent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
