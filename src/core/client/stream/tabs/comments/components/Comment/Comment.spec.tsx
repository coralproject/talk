import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Comment from "./Comment";

it("renders username and body", () => {
  const props: PropTypesOf<typeof Comment> = {
    id: "comment-id",
    username: "Marvin",
    body: "Woof",
    createdAt: "1995-12-17T03:24:00.000Z",
    topBarRight: "topBarRight",
    footer: "footer",
    showEditedMarker: true,
  };
  const wrapper = shallow(<Comment {...props} />);
  expect(wrapper).toMatchSnapshot();
});
