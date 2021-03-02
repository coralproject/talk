import { noop } from "lodash";
import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import UIContext, { UIContextProps } from "../UIContext";
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
  const context: UIContextProps = {
    renderWindow: window,
  };
  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <SelectField {...props} />
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
