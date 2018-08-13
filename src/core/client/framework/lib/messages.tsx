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
  <Localized id="framework-validation-tooShort">
    <span>This field is too short.</span>
  </Localized>
);

export const INVALID_EMAIL = () => (
  <Localized id="framework-validation-invalidEmail">
    <span>Please enter a valid email address.</span>
  </Localized>
);

export const INVALID_USERNAME = () => (
  <Localized id="framework-validation-invalidUsername">
    <span>Please enter a valid username.</span>
  </Localized>
);

export const INVALID_PASSWORD = () => (
  <Localized id="framework-validation-invalidUsername">
    <span>Please enter a valid password.</span>
  </Localized>
);

export const PASSWORDS_DO_NOT_MATCH = () => (
  <Localized id="framework-validation-passwordsDoNotMatch">
    <span>Passwords do not match. Try again.</span>
  </Localized>
);
