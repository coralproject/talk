import { shallow } from "enzyme";
import React from "react";

import CommentContent from "./CommentContent";

import { PropTypesOf } from "talk-framework/types";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CommentContent> = {
    suspectWords: ["idiot", "damn"],
    bannedWords: ["fuck", "fucking"],
    className: "custom",
    children: "Hello <strong>idiot</strong>, you fucking bastard",
  };
  const wrapper = shallow(<CommentContent {...props} />);
  expect(wrapper).toMatchSnapshot();
});
