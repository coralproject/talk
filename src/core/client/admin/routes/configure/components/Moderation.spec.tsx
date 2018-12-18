import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Moderation from "./Moderation";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Moderation> = {
    children: "child",
  };
  const wrapper = shallow(<Moderation {...props} />);
  expect(wrapper).toMatchSnapshot();
});
