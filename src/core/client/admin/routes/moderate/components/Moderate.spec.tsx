import { shallow } from "enzyme";
import React from "react";

import Moderate from "./Moderate";

import { PropTypesOf } from "talk-framework/types";
it("renders correctly", () => {
  const wrapper = shallow(<Moderate />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly with counts", () => {
  const props: PropTypesOf<typeof Moderate> = {
    unmoderatedCount: 3,
    reportedCount: 4,
    pendingCount: 0,
  };
  const wrapper = shallow(<Moderate {...props} />);
  expect(wrapper).toMatchSnapshot();
});
