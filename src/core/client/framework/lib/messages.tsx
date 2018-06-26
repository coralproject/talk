import { Localized } from "fluent-react/compat";
import React from "react";

/**
 * This file contains localization messages that are shared by
 * different parts of the framework.
 */

export const VALIDATION_REQUIRED = () => (
  <Localized id="framework-validation-required">
    <span>This field is required.</span>
  </Localized>
);

export const VALIDATION_TOO_SHORT = () => (
  <Localized id="framework-validation-too-short">
    <span>This field is too short.</span>
  </Localized>
);
