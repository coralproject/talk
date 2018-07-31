import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import { CommentContainer } from "./CommentContainer";

it("renders username and body", () => {
  const props: PropTypesOf<typeof CommentContainer> = {
    data: {
      id: "comment-id",
      author: {
        username: "Marvin",
      },
      body: "Woof",
      createdAt: "1995-12-17T03:24:00.000Z",
    },
  };

  const wrapper = shallow(<CommentContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});
