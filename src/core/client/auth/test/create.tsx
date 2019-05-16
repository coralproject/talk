import React from "react";

import AppQuery from "coral-auth/queries/AppQuery";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

export default function create(params: CreateTestRendererParams) {
  return createTestRenderer("auth", <AppQuery />, params);
}
