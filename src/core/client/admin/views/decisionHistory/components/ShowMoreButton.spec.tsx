import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import ShowMoreButton from "./ShowMoreButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ShowMoreButton> = {
    disabled: false,
    onClick: noop,
  };
  const wrapper = shallow(<ShowMoreButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});
