import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import Footer from "./Footer";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Footer> = {
    children: "children",
  };
  const wrapper = shallow(<Footer {...props} />);
  expect(wrapper).toMatchSnapshot();
});
