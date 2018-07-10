import React from "react";
import { create } from "react-test-renderer";

import UIContext from "../UIContext";
import Timestamp from "./Timestamp";

it("uses default formatter", () => {
  const props = {
    date: new Date("December 17, 2108 03:24:00").toISOString(),
  };
  const tree = create(<Timestamp {...props} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it("uses formatter from context", () => {
  const context: any = {
    timeagoFormatter: () => "My Formatter",
  };
  const props = {
    date: new Date("December 17, 2108 03:24:00").toISOString(),
  };
  const tree = create(
    <UIContext.Provider value={context}>
      <Timestamp {...props} />
    </UIContext.Provider>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
