import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "talk-ui/types";

import PasswordField from "./PasswordField";

it("renders correctly", () => {
  const props: PropTypesOf<typeof PasswordField> = {
    className: "custom",
    defaultValue: "Hello World",
  };
  const renderer = TestRenderer.create(<PasswordField {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();

  renderer.root.findByProps({ role: "button" }).props.onClick();
  expect(renderer.toJSON()).toMatchSnapshot();
});
