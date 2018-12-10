import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "talk-framework/types";

import Username from "./Username";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Username> = {
    children: "Marvin",
  };

  const testRenderer = TestRenderer.create(<Username {...props} />);
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
