import React from "react";

import AppQuery from "talk-auth/queries/AppQuery";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "talk-framework/testHelpers";

export default function create(params: CreateTestRendererParams) {
  return createTestRenderer("auth", <AppQuery />, params);
}
