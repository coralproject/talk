import React from "react";
import { create } from "react-test-renderer";

import UIContext from "../UIContext";
import RelativeTime from "./RelativeTime";

it("uses default formatter", () => {
  const props = {
    date: new Date("December 17, 2108 03:24:00").toISOString(),
  };
  const tree = create(<RelativeTime {...props} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it("uses formatter from context", () => {
  const context: any = {
    timeagoFormatter: () => "My Context Formatter",
  };
  const props = {
    date: new Date("December 17, 2108 03:24:00").toISOString(),
  };
  const tree = create(
    <UIContext.Provider value={context}>
      <RelativeTime {...props} />
    </UIContext.Provider>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it("uses formatter from props", () => {
  const props = {
    date: new Date("December 17, 2108 03:24:00").toISOString(),
    formatter: () => "My Props Formatter",
  };
  const tree = create(<RelativeTime {...props} />).toJSON();

  expect(tree).toMatchSnapshot();
});
