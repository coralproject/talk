// tslint:disable:max-classes-per-file

import { FluentBundle } from "fluent/compat";
import uuid from "uuid";
import { VError } from "verror";

import { ERROR_CODES } from "talk-common/errors";
import { translate } from "talk-server/services/i18n";

import { ERROR_TRANSLATIONS } from "./translations";

/**
 * TalkErrorTypes associates a class of errors with a specific code.
 */
export type TalkErrorTypes = "invalid_request_error";

/**
 * TalkErrorExtensions is the different extension data that is associated with
 * a given error. This data is surfaced in the GraphQL, REST error response as
 * well as via logs.
 */
export interface TalkErrorExtensions {
  /**
   * id identifies this specific error that was thrown, allowing offline tracing
   * to occur.
   */
  readonly id: string;

  /**
   * code is the identifier specific to this Error. No other TalkError should
   * share the same code.
   */
  readonly code: ERROR_CODES;

  /**
   * type represents the class of errors that this error is associated with.
   */
  readonly type: TalkErrorTypes;

  /**
   * message is the (optionally translated) message that can be shown to users.
   */
  message: string;

  /**
   * param, if set, references the fieldSpec to which the error is related to.
   * If for example an error occurred during email processing, this field could
   * be `input.email` to denote the specific input field that caused the error.
   */
  param?: string;
}

export interface TalkErrorContext {
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
 * TalkErrorOptions describes the options used to create a TalkError.
 */
export interface TalkErrorOptions {
  /**
   * code is the identifier specific to this Error. No other TalkError should
   * share the same code.
   */
  code: ERROR_CODES;

  /**
   * context stores the public and private details about the error.
   */
  context?: Partial<TalkErrorContext>;

  /**
   * status is the number sent via the REST error responses. GraphQL responses
   * do not involve this number.
   */
  status?: number;

  /**
   * type represents the class of errors that this error is associated with.
   */
  type?: TalkErrorTypes;

  /**
   * cause is the error that provides the root cause of the underlying error
   * that is thrown.
   */
  cause?: Error;
}

export class TalkError extends VError {
  /**
   * id identifies this specific error that was thrown, allowing offline tracing
   * to occur.
   */
  public readonly id: string;

  /**
   * code is the identifier specific to this Error. No other TalkError should
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
  public readonly type: TalkErrorTypes;

  /**
   * extensions is the set of readable properties that can be provided to
   * GraphQL responses.
   */
  public readonly extensions: TalkErrorExtensions;

  /**
   * context stores the public and private details about the error.
   */
  public readonly context: Readonly<TalkErrorContext>;

  constructor({
    code,
    context = {},
    status = 500,
    type = "invalid_request_error",
    cause,
  }: TalkErrorOptions) {
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
    this.extensions = {
      id: this.id,
      code: this.code,
      type: this.type,
      message: this.code,
    };
  }

  /**
   * linkToParam will set the `param` property on the error to indicate blame
   * for the error.
   *
   * @param param the name of the fieldSpec to link to the error cause
   */
  public linkToParam(param: string) {
    // Assign the param to the extension.
    this.extensions.param = param;
  }

  /**
   * translateMessage will translate the error `extensions.message` property to
   * the desired language based on the provided language bundle.
   *
   * @param bundle the translation bundle to use
   */
  public translateMessage(bundle: FluentBundle) {
    // Translate the message, but default to the code if the translation cannot
    // be found.
    this.extensions.message = translate(
      bundle,
      this.code,
      ERROR_TRANSLATIONS[this.code],
      this.context.pub
    );
  }
}

export class StoryURLInvalidError extends TalkError {
  constructor(properties: { storyURL: string; tenantDomains: string[] }) {
    super({
      code: ERROR_CODES.STORY_URL_NOT_PERMITTED,
      context: { pub: properties },
    });
  }
}

export class DuplicateUserError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.DUPLICATE_USER });
  }
}

export class EmailNotSetError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.EMAIL_NOT_SET });
  }
}

export class DuplicateStoryURLError extends TalkError {
  constructor(url: string) {
    super({ code: ERROR_CODES.DUPLICATE_STORY_URL, context: { pvt: { url } } });
  }
}

export class DuplicateUsernameError extends TalkError {
  constructor(username: string) {
    super({
      code: ERROR_CODES.DUPLICATE_USERNAME,
      context: { pvt: { username } },
    });
  }
}

export class DuplicateEmailError extends TalkError {
  constructor(email: string) {
    super({ code: ERROR_CODES.DUPLICATE_EMAIL, context: { pvt: { email } } });
  }
}

export class UsernameAlreadySetError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.USERNAME_ALREADY_SET });
  }
}

export class EmailAlreadySetError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.EMAIL_ALREADY_SET });
  }
}

export class LocalProfileNotSetError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.LOCAL_PROFILE_NOT_SET });
  }
}

export class LocalProfileAlreadySetError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.LOCAL_PROFILE_ALREADY_SET });
  }
}

export class UsernameContainsInvalidCharactersError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.USERNAME_CONTAINS_INVALID_CHARACTERS });
  }
}

export class UsernameExceedsMaxLengthError extends TalkError {
  constructor(length: number, max: number) {
    super({
      code: ERROR_CODES.USERNAME_EXCEEDS_MAX_LENGTH,
      context: { pub: { length, max } },
    });
  }
}

export class UsernameTooShortError extends TalkError {
  constructor(length: number, min: number) {
    super({
      code: ERROR_CODES.USERNAME_TOO_SHORT,
      context: { pub: { length, min } },
    });
  }
}

export class DisplayNameExceedsMaxLengthError extends TalkError {
  constructor(length: number, max: number) {
    super({
      code: ERROR_CODES.DISPLAY_NAME_EXCEEDS_MAX_LENGTH,
      context: { pub: { length, max } },
    });
  }
}

export class PasswordTooShortError extends TalkError {
  constructor(length: number, min: number) {
    super({
      code: ERROR_CODES.PASSWORD_TOO_SHORT,
      context: { pub: { length, min } },
    });
  }
}

export class EmailInvalidFormatError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.EMAIL_INVALID_FORMAT });
  }
}

export class EmailExceedsMaxLengthError extends TalkError {
  constructor(length: number, max: number) {
    super({
      code: ERROR_CODES.EMAIL_EXCEEDS_MAX_LENGTH,
      context: { pub: { length, max } },
    });
  }
}

export class TokenNotFoundError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.TOKEN_NOT_FOUND });
  }
}

export class TokenInvalidError extends TalkError {
  constructor(token: string, reason: string) {
    super({
      code: ERROR_CODES.TOKEN_INVALID,
      context: { pub: { token }, pvt: { reason } },
      status: 401,
    });
  }
}

export class UserForbiddenError extends TalkError {
  constructor(reason: string, userID: string | null) {
    super({
      code: ERROR_CODES.USER_FORBIDDEN,
      context: { pvt: { reason, userID } },
      status: 403,
    });
  }
}

export class UserNotFoundError extends TalkError {
  constructor(userID: string) {
    super({ code: ERROR_CODES.USER_NOT_FOUND, context: { pvt: { userID } } });
  }
}

export class TenantNotFoundError extends TalkError {
  constructor(hostname: string) {
    super({
      code: ERROR_CODES.TENANT_NOT_FOUND,
      context: { pub: { hostname } },
    });
  }
}

export class InternalError extends TalkError {
  constructor(cause: Error, reason: string) {
    super({
      code: ERROR_CODES.INTERNAL_ERROR,
      cause,
      context: { pvt: { reason } },
      status: 500,
    });
  }
}

export class NotFoundError extends TalkError {
  constructor(method: string, path: string) {
    super({
      code: ERROR_CODES.NOT_FOUND,
      status: 404,
      context: { pub: { method, path } },
    });
  }
}

export class TenantInstalledAlreadyError extends TalkError {
  constructor() {
    super({ code: ERROR_CODES.TENANT_INSTALLED_ALREADY, status: 400 });
  }
}
