import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "talk-ui/types";

import RadioButton from "./RadioButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof RadioButton> = {
    className: "custom",
    id: "radioID",
    name: "key",
    value: "true",
    children: "Yes I agree",
  };
  const renderer = TestRenderer.create(<RadioButton {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
