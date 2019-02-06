import { ErrorRequestHandler } from "express";

import { InternalError, TalkError } from "talk-server/errors";
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
 * serializeError will return a serialized error that can be returned via the
 * API response.
 *
 * @param err the TalkError that should be serialized
 * @param bundles the translation bundles
 * @param tenant the optional tenant to use when selecting the language
 */
const serializeError = (err: TalkError, req: Request, bundles: I18n) => {
  // Get the translation bundle.
  let bundle = bundles.getDefaultBundle();
  if (req.talk && req.talk.tenant) {
    bundle = bundles.getBundle(req.talk.tenant.locale);
  }

  return {
    error: err.serializeExtensions(bundle),
  };
};

export const JSONErrorHandler = (bundles: I18n): ErrorRequestHandler => (
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

export const HTMLErrorHandler = (bundles: I18n): ErrorRequestHandler => (
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
