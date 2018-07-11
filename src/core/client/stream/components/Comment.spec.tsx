import { shallow } from "enzyme";
import React from "react";

import Comment from "./Comment";

it("renders username and body", () => {
  const props = {
    author: {
      username: "Marvin",
    },
    body: "Woof",
  };
  const wrapper = shallow(<Comment {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders with gutterBottom", () => {
  const props = {
    author: {
      username: "Marvin",
    },
    body: "Woof",
    gutterBottom: true,
  };
  const wrapper = shallow(<Comment {...props} />);
  expect(wrapper).toMatchSnapshot();
});
