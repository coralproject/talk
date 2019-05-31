// tslint:disable:max-classes-per-file

import { FluentBundle } from "fluent/compat";
import uuid from "uuid";
import { VError } from "verror";

import { ERROR_CODES, ERROR_TYPES } from "coral-common/errors";
import { translate } from "coral-server/services/i18n";

import { GQLUSER_AUTH_CONDITIONS } from "coral-server/graph/tenant/schema/__generated__/types";
import { ERROR_TRANSLATIONS } from "./translations";

/**
 * CoralErrorExtensions is the different extension data that is associated with
 * a given error. This data is surfaced in the GraphQL, REST error response as
 * well as via logs.
 */
export interface CoralErrorExtensions {
  /**
   * id identifies this specific error that was thrown, allowing offline tracing
   * to occur.
   */
  readonly id: string;

  /**
   * code is the identifier specific to this Error. No other CoralError should
   * share the same code.
   */
  readonly code: ERROR_CODES;

  /**
   * type represents the class of errors that this error is associated with.
   */
  readonly type: ERROR_TYPES;

  /**
   * message is the (optionally translated) message that can be shown to users.
   */
  readonly message: string;

  /**
   * param, if set, references the fieldSpec to which the error is related to.
   * If for example an error occurred during email processing, this field could
   * be `input.email` to denote the specific input field that caused the error.
   */
  param?: string;
}

export interface CoralErrorContext {
  /**
   * pub stores information that is used by the translation framework
   * to provide context to the error being emitted to pass publicly. Sensitive
   * information should not be passed via this method.
   */
  pub: Record<string, any>;

  /**
   * pvt stores information that is logged out by the logging
   * framework to provide context for bug reporting software in the event that
   * the error is unexpected.
   */
  pvt: Record<string, any>;
}

/**
 * CoralErrorOptions describes the options used to create a CoralError.
 */
export interface CoralErrorOptions {
  /**
   * code is the identifier specific to this Error. No other CoralError should
   * share the same code.
   */
  code: ERROR_CODES;

  /**
   * context stores the public and private details about the error.
   */
  context?: Partial<CoralErrorContext>;

  /**
   * status is the number sent via the REST error responses. GraphQL responses
   * do not involve this number.
   */
  status?: number;

  /**
   * type represents the class of errors that this error is associated with.
   */
  type?: ERROR_TYPES;

  /**
   * cause is the error that provides the root cause of the underlying error
   * that is thrown.
   */
  cause?: Error;

  /**
   * param, if set, references the fieldSpec to which the error is related to.
   * If for example an error occurred during email processing, this field could
   * be `input.email` to denote the specific input field that caused the error.
   */
  param?: string;
}

export class CoralError extends VError {
  /**
   * id identifies this specific error that was thrown, allowing offline tracing
   * to occur.
   */
  public readonly id: string;

  /**
   * code is the identifier specific to this Error. No other CoralError should
   * share the same code.
   */
  public readonly code: ERROR_CODES;

  /**
   * status is the number sent via the REST error responses. GraphQL responses
   * do not involve this number.
   */
  public readonly status: number;

  /**
   * type represents the class of errors that this error is associated with.
   */
  public readonly type: ERROR_TYPES;

  /**
   * param, if set, references the fieldSpec to which the error is related to.
   * If for example an error occurred during email processing, this field could
   * be `input.email` to denote the specific input field that caused the error.
   */
  public param?: string;

  /**
   * context stores the public and private details about the error.
   */
  public readonly context: Readonly<CoralErrorContext>;

  constructor({
    code,
    context = {},
    status = 500,
    type = ERROR_TYPES.INVALID_REQUEST_ERROR,
    cause,
    param,
  }: CoralErrorOptions) {
    // Call the super method with the right arguments depending on if we're
    // supposed to be handling a causal error or not.
    if (cause) {
      super(cause, code);
    } else {
      super(code);
    }

    // Rename the error to have the name of the error that this extends.
    this.name = new.target.name;

    // Assign a unique ID to this error.
    const id = uuid.v1();
    this.status = status;

    // Capture the context for the error.
    const { pub = {}, pvt = {} } = context;
    this.context = { pub, pvt };

    // Capture the extension parameters.
    this.id = id;
    this.code = code;
    this.type = type;
    this.param = param;
  }

  public serializeExtensions(
    bundle: FluentBundle | null
  ): CoralErrorExtensions {
    let message: string;
    if (bundle) {
      message = translate(
        bundle,
        this.code,
        ERROR_TRANSLATIONS[this.code],
        this.context.pub
      );
    } else {
      message = this.code;
    }

    return {
      id: this.id,
      code: this.code,
      type: this.type,
      message,
      param: this.param,
    };
  }
}

export class CommentingDisabledError extends CoralError {
  constructor() {
    super({
      code: ERROR_CODES.COMMENTING_DISABLED,
    });
  }
}

export class StoryClosedError extends CoralError {
  constructor() {
    super({
      code: ERROR_CODES.STORY_CLOSED,
    });
  }
}

export class CommentBodyTooShortError extends CoralError {
  constructor(min: number) {
    super({
      code: ERROR_CODES.COMMENT_BODY_TOO_SHORT,
      context: { pub: { min } },
    });
  }
}

export class CommentBodyExceedsMaxLengthError extends CoralError {
  constructor(max: number) {
    super({
      code: ERROR_CODES.COMMENT_BODY_EXCEEDS_MAX_LENGTH,
      context: { pub: { max } },
    });
  }
}

export class URLInvalidError extends CoralError {
  constructor({
    url,
    ...properties
  }: {
    url: string;
    allowedDomains: string[];
    tenantDomain?: string;
  }) {
    super({
      code: ERROR_CODES.URL_NOT_PERMITTED,
      context: { pvt: properties, pub: { url } },
    });
  }
}

export class StoryURLInvalidError extends CoralError {
  constructor(properties: {
    storyURL: string;
    allowedDomains: string[];
    tenantDomain?: string;
  }) {
    super({
      code: ERROR_CODES.STORY_URL_NOT_PERMITTED,
      context: { pvt: properties },
    });
  }
}

export class DuplicateUserError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.DUPLICATE_USER });
  }
}

export class EmailNotSetError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.EMAIL_NOT_SET });
  }
}

export class DuplicateStoryURLError extends CoralError {
  constructor(url: string) {
    super({ code: ERROR_CODES.DUPLICATE_STORY_URL, context: { pvt: { url } } });
  }
}

export class DuplicateEmailError extends CoralError {
  constructor(email: string) {
    super({ code: ERROR_CODES.DUPLICATE_EMAIL, context: { pvt: { email } } });
  }
}

export class UsernameAlreadySetError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.USERNAME_ALREADY_SET });
  }
}

export class EmailAlreadySetError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.EMAIL_ALREADY_SET });
  }
}

export class LocalProfileNotSetError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.LOCAL_PROFILE_NOT_SET });
  }
}

export class LocalProfileAlreadySetError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.LOCAL_PROFILE_ALREADY_SET });
  }
}

export class UsernameContainsInvalidCharactersError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.USERNAME_CONTAINS_INVALID_CHARACTERS });
  }
}

export class UsernameExceedsMaxLengthError extends CoralError {
  constructor(length: number, max: number) {
    super({
      code: ERROR_CODES.USERNAME_EXCEEDS_MAX_LENGTH,
      context: { pub: { length, max } },
    });
  }
}

export class UsernameTooShortError extends CoralError {
  constructor(length: number, min: number) {
    super({
      code: ERROR_CODES.USERNAME_TOO_SHORT,
      context: { pub: { length, min } },
    });
  }
}

export class PasswordTooShortError extends CoralError {
  constructor(length: number, min: number) {
    super({
      code: ERROR_CODES.PASSWORD_TOO_SHORT,
      context: { pub: { length, min } },
    });
  }
}

export class EmailInvalidFormatError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.EMAIL_INVALID_FORMAT });
  }
}

export class EmailExceedsMaxLengthError extends CoralError {
  constructor(length: number, max: number) {
    super({
      code: ERROR_CODES.EMAIL_EXCEEDS_MAX_LENGTH,
      context: { pub: { length, max } },
    });
  }
}

export class TokenNotFoundError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.TOKEN_NOT_FOUND });
  }
}

export class TokenInvalidError extends CoralError {
  constructor(token: string, reason: string, cause?: Error) {
    super({
      code: ERROR_CODES.TOKEN_INVALID,
      cause,
      context: { pvt: { token, reason } },
      status: 401,
    });
  }
}

export class UserForbiddenError extends CoralError {
  constructor(
    reason: string,
    resource: string,
    operation: string,
    userID?: string,
    permit?: GQLUSER_AUTH_CONDITIONS[],
    conditions?: GQLUSER_AUTH_CONDITIONS[]
  ) {
    super({
      code: ERROR_CODES.USER_NOT_ENTITLED,
      context: {
        pvt: { reason, userID, resource, operation, conditions, permit },
      },
      status: 403,
    });
  }
}

export class UserNotFoundError extends CoralError {
  constructor(userID: string) {
    super({ code: ERROR_CODES.USER_NOT_FOUND, context: { pub: { userID } } });
  }
}

export class StoryNotFoundError extends CoralError {
  constructor(storyID: string) {
    super({ code: ERROR_CODES.STORY_NOT_FOUND, context: { pvt: { storyID } } });
  }
}

export class CommentNotFoundError extends CoralError {
  constructor(commentID: string) {
    super({
      code: ERROR_CODES.COMMENT_NOT_FOUND,
      context: { pvt: { commentID } },
    });
  }
}

export class TenantNotFoundError extends CoralError {
  constructor(hostname: string) {
    super({
      code: ERROR_CODES.TENANT_NOT_FOUND,
      context: { pub: { hostname } },
    });
  }
}

export class IntegrationDisabled extends CoralError {
  constructor(integrationName: string) {
    super({
      code: ERROR_CODES.INTEGRATION_DISABLED,
      context: { pvt: { integrationName } },
    });
  }
}

export class InternalError extends CoralError {
  constructor(cause: Error, reason: string) {
    super({
      code: ERROR_CODES.INTERNAL_ERROR,
      cause,
      context: { pvt: { reason } },
      status: 500,
    });
  }
}

export class NotFoundError extends CoralError {
  constructor(method: string, path: string) {
    super({
      code: ERROR_CODES.NOT_FOUND,
      status: 404,
      context: { pub: { method, path } },
    });
  }
}

export class TenantInstalledAlreadyError extends CoralError {
  constructor() {
    super({ code: ERROR_CODES.TENANT_INSTALLED_ALREADY, status: 400 });
  }
}

export class InvalidCredentialsError extends CoralError {
  constructor(reason: string) {
    super({
      code: ERROR_CODES.INVALID_CREDENTIALS,
      status: 401,
      context: { pvt: { reason } },
    });
  }
}

export class AuthenticationError extends CoralError {
  constructor(reason: string) {
    super({
      code: ERROR_CODES.AUTHENTICATION_ERROR,
      status: 401,
      context: { pvt: { reason } },
    });
  }
}

export class ToxicCommentError extends CoralError {
  constructor(model: string, score: number, threshold: number) {
    super({
      code: ERROR_CODES.TOXIC_COMMENT,
      type: ERROR_TYPES.MODERATION_NUDGE_ERROR,
      status: 400,
      context: { pvt: { model, score, threshold } },
    });
  }
}

export class SpamCommentError extends CoralError {
  constructor() {
    super({
      code: ERROR_CODES.SPAM_COMMENT,
      type: ERROR_TYPES.MODERATION_NUDGE_ERROR,
      status: 400,
    });
  }
}

export class UserAlreadySuspendedError extends CoralError {
  constructor(until: Date) {
    super({
      code: ERROR_CODES.USER_ALREADY_SUSPENDED,
      context: {
        pub: {
          until: until.toISOString(),
        },
      },
    });
  }
}

export class UserAlreadyBannedError extends CoralError {
  constructor() {
    super({
      code: ERROR_CODES.USER_ALREADY_BANNED,
    });
  }
}

export class UserBanned extends CoralError {
  constructor(userID: string, resource?: string, operation?: string) {
    super({
      code: ERROR_CODES.USER_BANNED,
      context: { pvt: { resource, operation, userID } },
    });
  }
}

export class UserSuspended extends CoralError {
  constructor(
    userID: string,
    until: Date,
    resource?: string,
    operation?: string
  ) {
    super({
      code: ERROR_CODES.USER_SUSPENDED,
      context: { pvt: { resource, operation, userID }, pub: { until } },
    });
  }
}

export class PasswordResetTokenExpired extends CoralError {
  constructor(reason: string, cause?: Error) {
    super({
      code: ERROR_CODES.PASSWORD_RESET_TOKEN_EXPIRED,
      cause,
      status: 400,
      context: { pvt: { reason } },
    });
  }
}

export class ConfirmEmailTokenExpired extends CoralError {
  constructor(reason: string, cause?: Error) {
    super({
      code: ERROR_CODES.EMAIL_CONFIRM_TOKEN_EXPIRED,
      cause,
      status: 400,
      context: { pvt: { reason } },
    });
  }
}

export class RateLimitExceeded extends CoralError {
  constructor(resource: string, max: number, tries: number) {
    super({
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      status: 429,
      context: { pvt: { resource, max, tries } },
    });
  }
}
