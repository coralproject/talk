import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Circle from "./Circle";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Circle> = {
    className: "root",
    hollow: true,
    end: true,
  };
  const wrapper = shallow(<Circle {...props} />);
  expect(wrapper).toMatchSnapshot();
});
