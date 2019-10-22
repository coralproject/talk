import React from "react";
import TestRenderer from "react-test-renderer";

import { InputDescription, InputLabel, TextField } from "../../components";
import FormField from "../FormField";

it("renders correctly", () => {
  const renderer = TestRenderer.create(
    <FormField>Form Components should go here</FormField>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("works with multiple form components", () => {
  const renderer = TestRenderer.create(
    <FormField>
      <InputLabel>Username</InputLabel>
      <InputDescription>
        An identifier displayed on your comments. You may use “_” and “.”
      </InputDescription>
      <TextField />
    </FormField>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
