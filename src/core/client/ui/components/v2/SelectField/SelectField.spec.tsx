import { noop } from "lodash";
import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import SelectField from "./SelectField";

it("renders correctly", () => {
  const props: PropTypesOf<typeof SelectField> = {
    id: "selectID",
    autofocus: true,
    name: "selectName",
    value: "pie",
    className: "customClassName",
    fullWidth: true,
    onChange: noop,
    disabled: true,
  };
  const renderer = TestRenderer.create(<SelectField {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
