import React from "react";

import App from "coral-account/App";
import { GQLResolver } from "coral-framework/schema";
import {
  createTestContext,
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

export default function create(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  return createTestRenderer<GQLResolver>("account", <App />, params);
}

export function createContext(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  return createTestContext<GQLResolver>("account", params);
}
