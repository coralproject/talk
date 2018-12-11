import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import SingleModerate from "./SingleModerate";

it("renders correctly", () => {
  const props: PropTypesOf<typeof SingleModerate> = {
    children: "singe comment queue",
  };
  const wrapper = shallow(<SingleModerate {...props} />);
  expect(wrapper).toMatchSnapshot();
});
