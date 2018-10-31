import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Logo from "./Logo";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Logo> = {
    className: "custom",
  };
  const wrapper = shallow(<Logo {...props} />);
  expect(wrapper).toMatchSnapshot();
});
