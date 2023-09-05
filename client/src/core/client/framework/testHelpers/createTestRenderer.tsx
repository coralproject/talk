/* eslint-disable no-restricted-globals */
import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";

import { CoralContextProvider } from "coral-framework/lib/bootstrap";
import { act } from "coral-framework/testHelpers";

import createTestContext, {
  CreateTestRendererParams,
} from "./createTestContext";

function createNodeMock(element: React.ReactElement<any>) {
  if (typeof element.type === "string") {
    return document.createElement(element.type);
  }
  return null;
}

export default function createTestRenderer<
  T extends { Query?: any; Mutation?: any } = any
>(
  target: string,
  element: React.ReactNode,
  params: CreateTestRendererParams<T>
) {
  const { context, subscriptionHandler } = createTestContext(target, params);

  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <CoralContextProvider value={context}>{element}</CoralContextProvider>,
      { createNodeMock }
    );
  });
  return {
    context,
    testRenderer: testRenderer!,
    subscriptionHandler,
  };
}
