import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Timestamp from "./Timestamp";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Timestamp> = {
    children: "1995-12-17T03:24:00.000Z",
  };
  const wrapper = shallow(<Timestamp {...props} />);
  expect(wrapper).toMatchSnapshot();
});
