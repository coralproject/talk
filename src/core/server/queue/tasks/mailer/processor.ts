import { Job } from "bull";
import { DOMLocalization } from "fluent-dom/compat";
import { FluentBundle } from "fluent/compat";
import { minify } from "html-minifier";
import htmlToText from "html-to-text";
import Joi from "joi";
import { JSDOM } from "jsdom";
import { juiceResources } from "juice";
import { camelCase } from "lodash";
import { Db } from "mongodb";
import { createTransport } from "nodemailer";
import now from "performance-now";

import { LanguageCode } from "talk-common/helpers/i18n/locales";
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
  templateName: string;
  message: {
    to: string;
    html: string;
  };
  tenantID: string;
}

const MailerDataSchema = Joi.object().keys({
  templateName: Joi.string(),
  message: Joi.object().keys({
    to: Joi.string(),
    html: Joi.string(),
  }),
  tenantID: Joi.string(),
});

interface Message {
  from: string;
  to: string;
  html: string;
  text: string;
  subject: string;
}

/**
 * juiceHTML will juice the HTML to inline the CSS and minify it.
 *
 * @param input html string to juice
 */
export function juiceHTML(input: string) {
  return new Promise<string>((resolve, reject) => {
    juiceResources(
      input,
      { webResources: { relativeTo: __dirname } },
      (err, html) => {
        if (err) {
          return reject(err);
        }

        return resolve(
          minify(html, {
            removeComments: true,
            collapseWhitespace: true,
          })
        );
      }
    );
  });
}

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

  async function translateMessage(
    locale: LanguageCode,
    fromAddress: string,
    data: MailerData
  ): Promise<Message> {
    // Setup the localization bundles.
    const bundle = i18n.getBundle(locale);
    const loc = new DOMLocalization([], generateBundleIterator(bundle));

    // Translate the HTML fragments.
    let dom: JSDOM;
    try {
      // Parse the rendered template.
      dom = new JSDOM(data.message.html, {});
    } catch (err) {
      logger.error({ err }, "could not parse the HTML for i18n");

      throw err;
    }

    // Translate the bundle.
    await loc.translateFragment(dom.window.document);

    // TODO: (wyattjoh) strip the i18n attributes from the source.

    // Grab the rendered HTML from the dom, and juice them.
    if (!dom.window.document.documentElement) {
      throw new Error("dom did not have a document element");
    }
    const translatedHTML = dom.window.document.documentElement.outerHTML;

    // Juice the HTML to inline resources.
    const html = await juiceHTML(translatedHTML);

    // Get the translated subject.
    const subject = translate(bundle, name, `email-subject-${camelCase(name)}`);

    // Generate the text content of the message from the HTML.
    const text = htmlToText.fromString(html);

    // Prepare the message payload.
    return {
      from: fromAddress,
      to: data.message.to,
      html,
      text,
      subject,
    };
  }

  return async (job: Job<MailerData>) => {
    const { value: data, error: err } = Joi.validate(
      job.data,
      MailerDataSchema,
      {
        stripUnknown: true,
        presence: "required",
        abortEarly: false,
      }
    );
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
    const { tenantID } = data;

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

    const { enabled, smtpURI, fromAddress } = tenant.email;
    if (!enabled) {
      log.error("not sending email, it was disabled");
      return;
    }

    if (!smtpURI) {
      log.error("email was enabled but the smtpURI configuration was missing");
      return;
    }

    if (!fromAddress) {
      log.error(
        "email was enabled but the fromAddress configuration was missing"
      );
      return;
    }

    const startTemplateGenerationTime = now();

    // Get the message to send.
    const message = await translateMessage(tenant.locale, fromAddress, data);

    // Compute the end time.
    const responseTime = Math.round(now() - startTemplateGenerationTime);
    log.trace({ responseTime }, "finished mail translation");

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

    const startMessageSendTime = now();

    // Send the mail message.
    await transport.sendMail(message);

    // Compute the end time.
    const messageSendResponseTime = Math.round(now() - startMessageSendTime);
    log.debug({ responseTime: messageSendResponseTime }, "sent the email");
  };
};
