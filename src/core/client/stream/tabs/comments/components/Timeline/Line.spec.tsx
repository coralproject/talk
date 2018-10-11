import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Line from "./Line";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Line> = {
    className: "root",
    dotted: true,
  };
  const wrapper = shallow(<Line {...props} />);
  expect(wrapper).toMatchSnapshot();
});
