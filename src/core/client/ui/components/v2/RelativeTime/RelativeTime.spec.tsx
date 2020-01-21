import React from "react";
import { create } from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import UIContext from "../UIContext";
import RelativeTime from "./RelativeTime";

it("uses default formatter", () => {
  const props = {
    date: "2018-12-17T03:24:00.000Z",
  };
  const tree = create(<RelativeTime {...props} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it("uses formatter from context", () => {
  const context: any = {
    timeagoFormatter: () => "My Context Formatter",
  };
  const props: PropTypesOf<typeof RelativeTime> = {
    date: "2018-12-17T03:24:00.000Z",
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
    date: "2018-12-17T03:24:00.000Z",
    formatter: () => "My Props Formatter",
  };
  const tree = create(<RelativeTime {...props} />).toJSON();

  expect(tree).toMatchSnapshot();
});
