import React from "react";
import TestRenderer from "react-test-renderer";

import FormField from "../FormField";
import HelperText from "../HelperText";
import Label from "../Label";
import TextField from "../TextField";

it("renders correctly", () => {
  const renderer = TestRenderer.create(
    <FormField>Form Components should go here</FormField>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("works with multiple form components", () => {
  const renderer = TestRenderer.create(
    <FormField>
      <Label>Username</Label>
      <HelperText>
        An identifier displayed on your comments. You may use “_” and “.”
      </HelperText>
      <TextField />
    </FormField>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
