import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Indent from "./Indent";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Indent> = {
    children: <div>Hello World</div>,
  };
  const wrapper = shallow(<Indent {...props} />);
  expect(wrapper).toMatchSnapshot();
});
