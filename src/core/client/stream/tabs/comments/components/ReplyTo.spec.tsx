import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import ReplyTo from "./ReplyTo";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyTo> = {
    username: "ParentAuthor",
  };
  const wrapper = shallow(<ReplyTo {...props} />);
  expect(wrapper).toMatchSnapshot();
});
