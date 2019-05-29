import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import MessageBox from "./MessageBox";
import MessageBoxIcon from "./MessageBoxIcon";

it("renders correctly", () => {
  const props: PropTypesOf<typeof MessageBox> = {
    className: "custom",
    children: "Hello World",
  };
  const renderer = TestRenderer.create(<MessageBox {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("renders icon", () => {
  const renderer = TestRenderer.create(
    <MessageBox>
      <MessageBoxIcon>alert</MessageBoxIcon>Alert MessageBox
    </MessageBox>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
