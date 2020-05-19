import { FluentBundle } from "@fluent/bundle/compat";

import { CoralError, WrappedInternalError } from "coral-server/errors";
import { I18n } from "coral-server/services/i18n";
import { ErrorRequestHandler, Request } from "coral-server/types/express";

/**
 * wrapError ensures that the error being propagated is a CoralError.
 *
 * @param err the error to be wrapped
 */
const wrapError = (err: Error) =>
  err instanceof CoralError
    ? err
    : new WrappedInternalError(err, "wrapped internal error");

/**
 * serializeError will return a serialized error that can be returned via the
 * API response.
 *
 * @param err the CoralError that should be serialized
 * @param req the request
 * @param bundles the translation bundles
 */
const serializeError = (err: CoralError, req: Request, bundles?: I18n) => {
  // Get the translation bundle.
  let bundle: FluentBundle | null = null;
  if (bundles) {
    bundle = bundles.getDefaultBundle();
    if (req.coral && req.coral.tenant) {
      bundle = bundles.getBundle(req.coral.tenant.locale);
    }
  }

  return {
    error: err.serializeExtensions(bundle),
  };
};

export const JSONErrorHandler = (bundles?: I18n): ErrorRequestHandler => (
  err,
  req,
  res,
  next
) => {
  // Wrap the error if it needs to be wrapped.
  const e = wrapError(err);

  // Send the response via JSON.
  res.status(e.status).json(serializeError(e, req, bundles));
};

export const HTMLErrorHandler = (bundles?: I18n): ErrorRequestHandler => (
  err,
  req,
  res,
  next
) => {
  // Wrap the error if it needs to be wrapped.
  const e = wrapError(err);

  // Send the response via HTML.
  res.status(e.status).render("error", serializeError(e, req, bundles));
};
