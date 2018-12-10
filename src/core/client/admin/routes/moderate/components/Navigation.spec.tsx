import { shallow } from "enzyme";
import React from "react";

import Navigation from "./Navigation";

import { PropTypesOf } from "talk-framework/types";
it("renders correctly", () => {
  const wrapper = shallow(<Navigation />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly with counts", () => {
  const props: PropTypesOf<typeof Navigation> = {
    unmoderatedCount: 3,
    reportedCount: 4,
    pendingCount: 0,
  };
  const wrapper = shallow(<Navigation {...props} />);
  expect(wrapper).toMatchSnapshot();
});
