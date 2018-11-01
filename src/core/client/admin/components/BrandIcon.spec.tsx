import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import BrandIcon from "./BrandIcon";

it("renders correctly", () => {
  const props: PropTypesOf<typeof BrandIcon> = {
    className: "custom",
    size: "lg",
  };
  const wrapper = shallow(<BrandIcon {...props} />);
  expect(wrapper).toMatchSnapshot();
});
