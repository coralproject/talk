import { LocalizationProvider } from "fluent-react/compat";
import { noop } from "lodash";
import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-framework/types";
import { UIContext, UIContextProps } from "coral-ui/components";

import SortMenu from "./SortMenu";

it("renders correctly on small screens", () => {
  const props: PropTypesOf<typeof SortMenu> = {
    orderBy: "CREATED_AT_ASC",
    onChange: noop,
    reactionSortLabel: "Most Reacted",
  };

  const context: UIContextProps = {
    mediaQueryValues: {
      width: 320,
    },
  };

  const testRenderer = TestRenderer.create(
    <LocalizationProvider bundles={[]}>
      <UIContext.Provider value={context}>
        <SortMenu {...props} />
      </UIContext.Provider>
    </LocalizationProvider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("renders correctly on big screens", () => {
  const props: PropTypesOf<typeof SortMenu> = {
    orderBy: "CREATED_AT_ASC",
    onChange: noop,
    reactionSortLabel: "Most Reacted",
  };

  const context: UIContextProps = {
    mediaQueryValues: {
      width: 1600,
    },
  };

  const testRenderer = TestRenderer.create(
    <LocalizationProvider bundles={[]}>
      <UIContext.Provider value={context}>
        <SortMenu {...props} />
      </UIContext.Provider>
    </LocalizationProvider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
