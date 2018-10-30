import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import App from "./App";

it("renders correctly", () => {
  const props: PropTypesOf<typeof App> = {
    children: "child",
  };
  const wrapper = shallow(<App {...props} />);
  expect(wrapper).toMatchSnapshot();
});
