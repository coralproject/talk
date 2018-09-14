import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Indent from "./Indent";

it("renders level0", () => {
  const props: PropTypesOf<typeof Indent> = {
    children: <div>Hello World</div>,
  };
  const wrapper = shallow(<Indent {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders level1", () => {
  const props: PropTypesOf<typeof Indent> = {
    level: 1,
    children: <div>Hello World</div>,
  };
  const wrapper = shallow(<Indent {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders without border", () => {
  const props: PropTypesOf<typeof Indent> = {
    level: 1,
    noBorder: true,
    children: <div>Hello World</div>,
  };
  const wrapper = shallow(<Indent {...props} />);
  expect(wrapper).toMatchSnapshot();
});
