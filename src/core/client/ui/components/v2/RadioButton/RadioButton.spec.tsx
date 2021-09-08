import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import UIContext, { UIContextProps } from "../UIContext";
import RadioButton from "./RadioButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof RadioButton> = {
    className: "custom",
    id: "radioID",
    name: "key",
    value: "true",
    children: "Yes I agree",
  };
  const context: UIContextProps = {
    renderWindow: window,
  };
  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      {<RadioButton {...props} />}
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
