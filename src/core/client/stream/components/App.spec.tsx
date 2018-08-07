import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import App from "./App";

it("renders stream", () => {
  const props: PropTypesOf<typeof App> = {
    showPermalinkView: false,
  };
  const wrapper = shallow(<App {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders permalink view", () => {
  const props: PropTypesOf<typeof App> = {
    showPermalinkView: true,
  };
  const wrapper = shallow(<App {...props} />);
  expect(wrapper).toMatchSnapshot();
});
