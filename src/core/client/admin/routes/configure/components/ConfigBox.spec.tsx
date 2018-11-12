import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import ConfigBox from "./ConfigBox";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ConfigBox> = {
    topRight: <span>topRight</span>,
    title: <span>title</span>,
    children: "child",
  };
  const wrapper = shallow(<ConfigBox {...props} />);
  expect(wrapper).toMatchSnapshot();
});
