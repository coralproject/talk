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

export const VALIDATION_TOO_SHORT = (minLength: number) => (
  <Localized id="framework-validation-tooShort">
    <span>{"This field must contain at least {$minLength} characters."}</span>
  </Localized>
);

export const INVALID_EMAIL = () => (
  <Localized id="framework-validation-invalidEmail">
    <span>Please enter a valid email address.</span>
  </Localized>
);

export const INVALID_CHARACTERS = () => (
  <Localized id="framework-validation-invalidCharacters">
    <span>Invalid characters. Try again.</span>
  </Localized>
);

export const USERNAME_TOO_SHORT = (minLength: number) => (
  <Localized id="framework-validation-usernameTooShort" $minLength={minLength}>
    <span>{"Usernames must contain at least {$minLength} characters."}</span>
  </Localized>
);

export const USERNAME_TOO_LONG = (maxLength: number) => (
  <Localized id="framework-validation-usernameTooLong" $maxLength={maxLength}>
    <span>{"Usernames cannot be longer than {$maxLength} characters."}</span>
  </Localized>
);

export const PASSWORD_TOO_SHORT = (minLength: number) => (
  <Localized id="framework-validation-passwordTooShort" $minLength={minLength}>
    <span>{"Password must contain at least {$minLength} characters."}</span>
  </Localized>
);

export const PASSWORDS_DO_NOT_MATCH = () => (
  <Localized id="framework-validation-passwordsDoNotMatch">
    <span>Passwords do not match. Try again.</span>
  </Localized>
);

export const EMAILS_DO_NOT_MATCH = () => (
  <Localized id="framework-validation-emailsDoNotMatch">
    <span>Emails do not match. Try again.</span>
  </Localized>
);

export const INVALID_URL = () => (
  <Localized id="framework-validation-invalidURL">
    <span>Invalid URL</span>
  </Localized>
);
