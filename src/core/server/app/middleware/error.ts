import { ErrorRequestHandler } from "express";

import { ERROR_CODES } from "talk-common/errors";
import { InternalError, TalkError, TalkErrorTypes } from "talk-server/errors";
import { I18n } from "talk-server/services/i18n";
import { Request } from "talk-server/types/express";

/**
 * wrapError ensures that the error being propagated is a TalkError.
 *
 * @param err the error to be wrapped
 */
const wrapError = (err: Error) =>
  err instanceof TalkError
    ? err
    : new InternalError(err, "wrapped internal error");

/**
 * SerializedError is a serialized error that can be returned via the API
 * response.
 */
export interface SerializedError {
  id: string;
  code: ERROR_CODES;
  type: TalkErrorTypes;
  message: string;
}

/**
 * serializeError will return a serialized error that can be returned via the
 * API response.
 *
 * @param err the TalkError that should be serialized
 * @param bundles the translation bundles
 * @param tenant the optional tenant to use when selecting the language
 */
const serializeError = (
  err: TalkError,
  req: Request,
  bundles: I18n
): { error: SerializedError } => {
  // Get the translation bundle.
  let bundle = bundles.getDefaultBundle();
  if (req.talk && req.talk.tenant) {
    bundle = bundles.getBundle(req.talk.tenant.locale);
  }

  // Translate the bundle.
  err.translateMessage(bundle);

  return {
    error: err.extensions,
  };
};

export const apiErrorHandler = (bundles: I18n): ErrorRequestHandler => (
  err,
  req,
  res,
  next
) => {
  // Wrap the error if it needs to be wrapped.
  err = wrapError(err);

  // Send the response via JSON.
  res.status(err.status).json(serializeError(err, req, bundles));
};

export const errorHandler = (bundles: I18n): ErrorRequestHandler => (
  err,
  req,
  res,
  next
) => {
  // Wrap the error if it needs to be wrapped.
  err = wrapError(err);

  // Send the response via HTML.
  res.status(err.status).render("error", serializeError(err, req, bundles));
};
