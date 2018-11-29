import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Timestamp from "./Timestamp";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Timestamp> = {
    children: "2018-07-06T18:24:00.000Z",
  };
  const wrapper = shallow(<Timestamp {...props} />);
  expect(wrapper).toMatchSnapshot();
});
