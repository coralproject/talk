import { shallow } from "enzyme";
import React from "react";

import { CommentContainer } from "./CommentContainer";

it("renders username and body", () => {
  const props = {
    data: {
      author: {
        username: "Marvin",
      },
      body: "Woof",
      createdAt: new Date("December 17, 1995 03:24:00").toISOString(),
    },
  };

  const wrapper = shallow(<CommentContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});
