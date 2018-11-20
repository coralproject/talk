import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Navigation from "./Navigation";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Navigation> = {
    children: "child",
  };
  const wrapper = shallow(<Navigation {...props} />);
  expect(wrapper).toMatchSnapshot();
});
