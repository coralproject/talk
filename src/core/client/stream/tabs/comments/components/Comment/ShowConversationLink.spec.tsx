import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import ShowConversationLink from "./ShowConversationLink";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ShowConversationLink> = {
    id: "id",
    onClick: noop,
    href: "http://localhost/comment",
  };
  const wrapper = shallow(<ShowConversationLink {...props} />);
  expect(wrapper).toMatchSnapshot();
});
