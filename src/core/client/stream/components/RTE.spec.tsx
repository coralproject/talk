import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import RTE from "./RTE";

it("renders correctly", () => {
  const props: PropTypesOf<typeof RTE> = {
    className: "custom",
    placeholder: "Post a comment",
    value: "Hello world",
  };
  const wrapper = shallow(<RTE {...props} />);
  expect(wrapper).toMatchSnapshot();
});
