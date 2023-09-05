import React from "react";

import App from "coral-auth/App";
import {
  createTestContext,
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

export default function create(params: CreateTestRendererParams) {
  return createTestRenderer("auth", <App />, params);
}

export function createContext(params: CreateTestRendererParams) {
  return createTestContext("auth", params);
}
