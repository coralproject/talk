import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import PoweredBy from "./PoweredBy";

it("renders correctly", () => {
  const props: PropTypesOf<typeof PoweredBy> = {
    className: "custom",
  };
  const wrapper = shallow(<PoweredBy {...props} />);
  expect(wrapper).toMatchSnapshot();
});
