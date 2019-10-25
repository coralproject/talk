import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import CheckBox from "./CheckBox";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CheckBox> = {
    className: "custom",
    id: "checkboxID",
    checked: true,
    children: "Yes I agree",
  };
  const renderer = TestRenderer.create(<CheckBox {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
