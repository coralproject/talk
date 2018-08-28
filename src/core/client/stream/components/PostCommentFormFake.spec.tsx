import { shallow } from "enzyme";
import React from "react";

import PostCommentFormFake from "./PostCommentFormFake";

it("renders correctly", () => {
  const wrapper = shallow(<PostCommentFormFake />);
  expect(wrapper).toMatchSnapshot();
});
