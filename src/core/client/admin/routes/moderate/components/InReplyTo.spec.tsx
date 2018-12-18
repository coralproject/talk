import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import InReplyTo from "./InReplyTo";

it("renders correctly", () => {
  const props: PropTypesOf<typeof InReplyTo> = {
    children: "Username",
  };
  const wrapper = shallow(<InReplyTo {...props} />);
  expect(wrapper).toMatchSnapshot();
});
