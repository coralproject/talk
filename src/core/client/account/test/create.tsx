import React from "react";

import App from "talk-account/App";
import { GQLResolver } from "talk-framework/schema";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "talk-framework/testHelpers";

export default function create(params: CreateTestRendererParams<GQLResolver>) {
  return createTestRenderer<GQLResolver>("account", <App />, params);
}
