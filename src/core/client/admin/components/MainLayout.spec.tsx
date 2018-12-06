import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import MainLayout from "./MainLayout";

it("renders correctly", () => {
  const props: PropTypesOf<typeof MainLayout> = {
    children: "content",
  };
  const wrapper = shallow(<MainLayout {...props} />);
  expect(wrapper).toMatchSnapshot();
});
