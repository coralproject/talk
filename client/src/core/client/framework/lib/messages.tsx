import { Localized } from "@fluent/react/compat";
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
  <Localized id="framework-validation-tooShort" vars={{ minLength }}>
    <span>Please enter at least {minLength} characters.</span>
  </Localized>
);

export const VALIDATION_TOO_LONG = (maxLength: number) => (
  <Localized id="framework-validation-tooLong" vars={{ maxLength }}>
    <span>Please enter at max {maxLength} characters.</span>
  </Localized>
);

export const INVALID_EMAIL = () => (
  <Localized id="framework-validation-invalidEmail">
    <span>Please enter a valid email address.</span>
  </Localized>
);

export const INVALID_EMAIL_DOMAIN = () => (
  <Localized id="framework-validation-invalidEmailDomain">
    <span>Invalid email domain format. Please use "email.com"</span>
  </Localized>
);

export const INVALID_CHARACTERS = () => (
  <Localized id="framework-validation-invalidCharacters">
    <span>Invalid characters. Try again.</span>
  </Localized>
);

export const USERNAME_TOO_SHORT = (minLength: number) => (
  <Localized id="framework-validation-usernameTooShort" vars={{ minLength }}>
    <span>Usernames must contain at least {minLength} characters.</span>
  </Localized>
);

export const USERNAME_TOO_LONG = (maxLength: number) => (
  <Localized id="framework-validation-usernameTooLong" vars={{ maxLength }}>
    <span>Usernames cannot be longer than {maxLength} characters.</span>
  </Localized>
);

export const PASSWORD_TOO_SHORT = (minLength: number) => (
  <Localized id="framework-validation-passwordTooShort" vars={{ minLength }}>
    <span>Password must contain at least {minLength} characters.</span>
  </Localized>
);

export const PASSWORDS_DO_NOT_MATCH = () => (
  <Localized id="framework-validation-passwordsDoNotMatch">
    <span>Passwords do not match. Try again.</span>
  </Localized>
);

export const INVALID_WEBHOOK_ENDPOINT_EVENT_SELECTION = () => (
  <Localized id="framework-validation-invalidWebhookEndpointEventSelection">
    <span>Select at least one event to receive.</span>
  </Localized>
);

export const USERNAMES_DO_NOT_MATCH = () => (
  <Localized id="framework-validation-usernamesDoNotMatch">
    <span>Usernames do not match. Try again.</span>
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

export const NOT_A_WHOLE_NUMBER = () => (
  <Localized id="framework-validation-notAWholeNumber">
    <span>Please enter a valid whole number</span>
  </Localized>
);

export const NOT_A_WHOLE_NUMBER_GREATER_THAN = (x: number) => (
  <Localized id="framework-validation-notAWholeNumberGreaterThan" vars={{ x }}>
    <span>Please enter a valid whole number greater than {x}</span>
  </Localized>
);

export const NOT_A_WHOLE_NUMBER_GREATER_THAN_OR_EQUAL = (x: number) => (
  <Localized
    id="framework-validation-notAWholeNumberGreaterThanOrEqual"
    vars={{ x }}
  >
    <span>Please enter a valid whole number greater than or equal to {x}</span>
  </Localized>
);

export const NOT_A_WHOLE_NUMBER_BETWEEN = (min: number, max: number) => (
  <Localized
    id="framework-validation-notAWholeNumberBetween"
    vars={{ min, max }}
  >
    <span>Please enter a valid whole number between min and max</span>
  </Localized>
);

export const DELETE_CONFIRMATION_INVALID = () => (
  <Localized id="framework-validation-deleteConfirmationInvalid">
    <span>Incorrect confirmation. Try again.</span>
  </Localized>
);

export const INVALID_MEDIA_URL = () => (
  <Localized id="framework-validation-media-url-invalid">
    <span>Please enter a valid image URL (.png, .jpg, or .gif)</span>
  </Localized>
);

export const INVALID_EXTERNAL_PROFILE_URL = () => (
  <Localized id="framework-validation-invalidExternalProfileURL">
    <span>
      All external profile URL patterns must contain either $USER_NAME or
      $USER_ID.
    </span>
  </Localized>
);
