import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import BrandName from "./BrandName";

it("renders correctly", () => {
  const props: PropTypesOf<typeof BrandName> = {
    align: "center",
    className: "custom",
    size: "lg",
  };
  const wrapper = shallow(<BrandName {...props} />);
  expect(wrapper).toMatchSnapshot();
});
