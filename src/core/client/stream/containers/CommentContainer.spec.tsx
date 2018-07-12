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
    },
  };

  const wrapper = shallow(<CommentContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});
