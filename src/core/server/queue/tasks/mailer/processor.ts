import { Job } from "bull";
import { DOMLocalization } from "fluent-dom/compat";
import { FluentBundle } from "fluent/compat";
import htmlToText from "html-to-text";
import Joi from "joi";
import { JSDOM } from "jsdom";
import { camelCase } from "lodash";
import { Db } from "mongodb";
import { createTransport } from "nodemailer";

import { Config } from "talk-server/config";
import logger from "talk-server/logger";
import { I18n, translate } from "talk-server/services/i18n";
import TenantCache from "talk-server/services/tenant/cache";
import { TenantCacheAdapter } from "talk-server/services/tenant/cache/adapter";

export const JOB_NAME = "mailer";

export interface MailProcessorOptions {
  config: Config;
  mongo: Db;
  tenantCache: TenantCache;
  i18n: I18n;
}

export interface MailerData {
  name: string;
  message: {
    to: string;
    html: string;
  };
  tenantID: string;
}

const MailerDataSchema = Joi.object().keys({
  name: Joi.string(),
  message: Joi.object().keys({
    to: Joi.string(),
    html: Joi.string(),
  }),
  tenantID: Joi.string(),
});

function generateBundleIterator(bundle: FluentBundle) {
  return function* generate(resourceIDs: string[]) {
    yield bundle;
  };
}

export const createJobProcessor = (options: MailProcessorOptions) => {
  const { tenantCache, i18n } = options;

  // Create the cache adapter that will handle invalidating the email transport
  // when the tenant experiences a change.
  const cache = new TenantCacheAdapter<ReturnType<typeof createTransport>>(
    tenantCache
  );

  return async (job: Job<MailerData>) => {
    const { value, error: err } = Joi.validate(job.data, MailerDataSchema, {
      stripUnknown: true,
      presence: "required",
      abortEarly: false,
    });
    if (err) {
      logger.error(
        {
          jobID: job.id,
          jobName: JOB_NAME,
          err,
        },
        "job data did not match expected schema"
      );
      return;
    }

    // Pull the data out of the validated model.
    const {
      name,
      message,
      message: { to },
      tenantID,
    } = value;

    const log = logger.child({
      jobID: job.id,
      jobName: JOB_NAME,
      tenantID,
    });

    // Get the referenced tenant so we know who to send it from.
    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    const { enabled, smtpURI, fromAddress: from } = tenant.email;
    if (!enabled) {
      log.error("not sending email, it was disabled");
      return;
    }

    if (!smtpURI) {
      log.error("email was enabled but the smtpURI configuration was missing");
      return;
    }

    if (!from) {
      log.error(
        "email was enabled but the fromAddress configuration was missing"
      );
      return;
    }

    // Translate the HTML fragments.
    let dom: JSDOM;
    try {
      // Parse the rendered template.
      dom = new JSDOM(message.html, {});
    } catch (err) {
      logger.error({ err }, "could not parse the HTML for i18n");

      throw err;
    }

    // Setup the localization bundles.
    const bundle = i18n.getBundle(tenant.locale);
    const loc = new DOMLocalization([], generateBundleIterator(bundle));

    // Get the translated subject.
    const subject = translate(bundle, name, `email-subject-${camelCase(name)}`);

    // Translate the bundle.
    await loc.translateFragment(dom.window.document);

    // TODO: (wyattjoh) strip the i18n attributes from the source.

    // Grab the rendered HTML from the dom.
    if (!dom.window.document.documentElement) {
      throw new Error("dom did not have a document element");
    }
    const html = dom.window.document.documentElement.outerHTML;

    // Generate the text content of the message from the HTML.
    const text = htmlToText.fromString(html);

    let transport = cache.get(tenantID);
    if (!transport) {
      // Create the transport based on the smtp uri.
      transport = createTransport(smtpURI);

      // Set the transport back into the cache.
      cache.set(tenantID, transport);

      log.debug("transport was not cached");
    } else {
      log.debug("transport was cached");
    }

    log.debug("starting to send the email");

    // Send the mail message.
    await transport.sendMail({
      subject,
      html,
      text,
      from,
      to,
    });

    log.debug("sent the email");
  };
};
