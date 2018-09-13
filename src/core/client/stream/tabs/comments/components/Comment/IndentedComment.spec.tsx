import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import IndentedComment from "./IndentedComment";

it("renders correctly", () => {
  const props: PropTypesOf<typeof IndentedComment> = {
    indentLevel: 1,
    author: {
      username: "Marvin",
    },
    body: "Woof",
    createdAt: "1995-12-17T03:24:00.000Z",
  };
  const wrapper = shallow(<IndentedComment {...props} />);
  expect(wrapper).toMatchSnapshot();
});
