import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import ReplyButton from "./ReplyButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyButton> = {
    id: "id",
    onClick: noop,
    active: true,
  };
  const wrapper = shallow(<ReplyButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});
