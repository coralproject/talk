import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import AcceptedComment from "./AcceptedComment";

it("renders correctly", () => {
  const props: PropTypesOf<typeof AcceptedComment> = {
    href: "#",
    username: "InTheExpensiveSeats",
    date: "2018-07-06T18:24:00.000Z",
    onGotoComment: noop,
  };
  const wrapper = shallow(<AcceptedComment {...props} />);
  expect(wrapper).toMatchSnapshot();
});
