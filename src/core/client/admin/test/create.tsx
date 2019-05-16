import React from "react";

import EntryContainer from "coral-admin/containers/EntryContainer";
import { GQLResolver } from "coral-framework/schema";
import {
  createTestRenderer,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

export default function create(params: CreateTestRendererParams<GQLResolver>) {
  return createTestRenderer<GQLResolver>("admin", <EntryContainer />, params);
}
