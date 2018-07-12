import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import App from "./App";

it("renders correctly", () => {
  const props: PropTypesOf<typeof App> = {
    asset: {},
  };
  const wrapper = shallow(<App {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly when asset is null", () => {
  const props: PropTypesOf<typeof App> = {
    asset: null,
  };
  const wrapper = shallow(<App {...props} />);
  expect(wrapper).toMatchSnapshot();
});
