import React from "react";

import App from "coral-account/App";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import { GQLResolver } from "coral-framework/testHelpers/schema";

export default function create(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  return createTestRenderer<GQLResolver>("account", <App />, params);
}
