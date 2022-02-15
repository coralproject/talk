import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Navigation from "./Navigation";

jest.mock("found/useRouter", () => {
  return function useRouter() {
    return {
      router: {
        addNavigationListener: jest.fn(),
        createHref: jest.fn(),
        createLocation: jest.fn(),
        go: jest.fn(),
        isActive: jest.fn(),
        matcher: {
          match: jest.fn(),
          getRoutes: jest.fn(),
          isActive: jest.fn(),
          format: jest.fn(),
        },
        push: jest.fn(),
        replace: jest.fn(),
        replaceRouterConfig: jest.fn(),
      },
      match: {
        context: undefined,
        location: {
          action: "",
          delta: 0,
          hash: "",
          index: 0,
          key: "",
          pathname: "",
          query: {},
          search: "",
          state: undefined,
        },
        params: {
          org: "",
          view: "",
        },
        route: {},
        routeIndices: [],
        routeParams: null,
        routes: [],
      },
    };
  };
});

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Navigation />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly with counts", () => {
  const props: PropTypesOf<typeof Navigation> = {
    unmoderatedCount: 3,
    reportedCount: 4,
    pendingCount: 0,
  };
  const renderer = createRenderer();
  renderer.render(<Navigation {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
