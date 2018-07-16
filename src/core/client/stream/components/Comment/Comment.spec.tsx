import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Comment from "./Comment";

it("renders username and body", () => {
<<<<<<< HEAD:src/core/client/stream/components/Comment.spec.tsx
  const props = {
    id: "id",
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
    id: "id",
=======
  const props: PropTypesOf<typeof Comment> = {
>>>>>>> abfa39529ff398007bb67cd814c4217a97bdb38b:src/core/client/stream/components/Comment/Comment.spec.tsx
    author: {
      username: "Marvin",
    },
    body: "Woof",
    createdAt: "1995-12-17T03:24:00.000Z",
  };
  const wrapper = shallow(<Comment {...props} />);
  expect(wrapper).toMatchSnapshot();
});
