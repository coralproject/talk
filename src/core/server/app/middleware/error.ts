import { FluentBundle } from "@fluent/bundle/compat";
import { Response } from "express";

import {
  CoralError,
  CoralErrorExtensions,
  WrappedInternalError,
} from "coral-server/errors";
import logger from "coral-server/logger";
import { ErrorReport, ErrorReporterScope } from "coral-server/services/errors";
import { I18n } from "coral-server/services/i18n";
import { ErrorRequestHandler, Request } from "coral-server/types/express";

import { AppOptions } from "../";
import { extractLoggerMetadata } from "./logging";

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

type ErrorHandlerOptions = Partial<Pick<AppOptions, "i18n" | "reporter">>;

interface ErrorHandlerResponse {
  status: number;
  context: {
    error: CoralErrorExtensions;
    report: ErrorReport | null;
  };
}

function wrapAndReport(
  err: Error,
  req: Request,
  res: Response,
  { i18n, reporter }: ErrorHandlerOptions
): ErrorHandlerResponse {
  // Grab the logger.
  const log = req.coral ? req.coral.logger : logger;

  // Wrap the error if it needs to be wrapped.
  const e = wrapError(err);

  // Serialize the error.
  const { error } = serializeError(e, req, i18n);

  // If there's no reporter active, then return now.
  if (!reporter) {
    // Log the error.
    log.error(
      { ...extractLoggerMetadata(req, res), err, statusCode: e.status },
      "http error"
    );

    return {
      status: e.status,
      context: {
        error,
        report: null,
      },
    };
  }

  // Collect the error scope for the reporter.
  const scope: ErrorReporterScope = {
    ipAddress: req.ip,
  };

  // Add Tenant details to the scope.
  if (req.coral.tenant) {
    scope.tenantID = req.coral.tenant.id;
    scope.tenantDomain = req.coral.tenant.domain;

    // Can't have a User if we don't have a Tenant.. So check now that we have a
    // User and add it to the scope.
    if (req.user) {
      scope.userID = req.user.id;
      scope.userRole = req.user.role;
    }
  }

  // Report the error.
  const report = reporter.report(e, scope);

  // Log the error.
  log.error(
    {
      ...extractLoggerMetadata(req, res),
      err,
      statusCode: e.status,
      report,
    },
    "http error"
  );

  return {
    status: e.status,
    context: {
      error,
      report,
    },
  };
}

export const JSONErrorHandler = (
  options: ErrorHandlerOptions = {}
): ErrorRequestHandler => (err, req, res, next) => {
  const { status, context } = wrapAndReport(err, req, res, options);

  // Send the response via JSON.
  res.status(status).json(context);
};

export const HTMLErrorHandler = (
  options: ErrorHandlerOptions = {}
): ErrorRequestHandler => (err, req, res, next) => {
  const { status, context } = wrapAndReport(err, req, res, options);

  // Send the response via HTML.
  res.status(status).render("error", context);
};
