import { Job } from "bull";
import createDOMPurify from "dompurify";
import { DOMLocalization } from "fluent-dom/compat";
import { FluentBundle } from "fluent/compat";
import { minify } from "html-minifier";
import htmlToText from "html-to-text";
import Joi from "joi";
import { JSDOM } from "jsdom";
import { juiceResources } from "juice";
import { camelCase, isNil } from "lodash";
import { Db } from "mongodb";
import { createTransport } from "nodemailer";
import { Options } from "nodemailer/lib/smtp-connection";
import now from "performance-now";

import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { Config } from "coral-server/config";
import { InternalError } from "coral-server/errors";
import logger from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";
import { I18n, translate } from "coral-server/services/i18n";
import TenantCache from "coral-server/services/tenant/cache";
import { TenantCacheAdapter } from "coral-server/services/tenant/cache/adapter";

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

function createMessageTranslator(i18n: I18n) {
  /**
   * translateMessage will translate the message to the specified locale as well
   * a juice the contents.
   *
   * @param tenant the tenant
   * @param templateName the name of the template to base the translations off of
   * @param locale the locale to translate the email content into
   * @param fromAddress the address that is sending the email (from the Tenant)
   * @param data data used to send the message
   */
  return async (
    tenant: Tenant,
    templateName: string,
    locale: LanguageCode,
    fromAddress: string,
    data: MailerData
  ): Promise<Message> => {
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

    // Grab the rendered HTML from the dom, and juice them.
    if (!dom.window.document.documentElement) {
      throw new Error("dom did not have a document element");
    }

    // Configure the purification.
    const purify = createDOMPurify(dom.window);

    // Strip the l10n attributes from the email HTML.
    purify.sanitize(dom.window.document.documentElement, {
      ALLOW_DATA_ATTR: false,
      WHOLE_DOCUMENT: true,
      SANITIZE_DOM: false,
      RETURN_DOM: false,
      ADD_TAGS: ["link"],
      FORBID_TAGS: [],
      FORBID_ATTR: [],
      IN_PLACE: true,
    });

    // Juice the HTML to inline resources.
    const html = await juiceHTML(dom.serialize());

    // Get the translated subject.
    const subject = translate(
      bundle,
      templateName,
      `email-subject-${camelCase(templateName)}`,
      { organizationName: tenant.organization.name }
    );

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
  };
}

export const createJobProcessor = (options: MailProcessorOptions) => {
  const { tenantCache, i18n } = options;

  // Create the cache adapter that will handle invalidating the email transport
  // when the tenant experiences a change.
  const cache = new TenantCacheAdapter<ReturnType<typeof createTransport>>(
    tenantCache
  );

  // Create the message translator function.
  const translateMessage = createMessageTranslator(i18n);

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

    const log = logger.child(
      {
        jobID: job.id,
        jobName: JOB_NAME,
        tenantID,
      },
      true
    );

    // Get the referenced tenant so we know who to send it from.
    const tenant = await tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      log.error("referenced tenant was not found");
      return;
    }

    const { enabled, smtp, fromEmail, fromName } = tenant.email;
    if (!enabled) {
      log.error("not sending email, it was disabled");
      return;
    }

    // Check that we have enough to generate the smtp credentials.
    if (isNil(smtp.secure) || isNil(smtp.host) || isNil(smtp.port)) {
      log.error("email enabled, but configuration is incomplete");
      return;
    }

    if (!fromEmail) {
      log.error(
        "email was enabled but the fromAddress configuration was missing"
      );
      return;
    }

    // Construct the fromAddress.
    const fromAddress = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

    const startTemplateGenerationTime = now();

    // Get the message to send.
    let message: Message;
    try {
      message = await translateMessage(
        tenant,
        data.templateName,
        tenant.locale,
        fromAddress,
        data
      );
    } catch (e) {
      throw new InternalError(e, "could not translate the message");
    }

    // Compute the end time.
    const responseTime = Math.round(now() - startTemplateGenerationTime);
    log.trace({ responseTime }, "finished mail translation");

    let transport = cache.get(tenantID);
    if (!transport) {
      try {
        // Create the new transport options.
        const opts: Options = {
          host: smtp.host,
          port: smtp.port,
          secure: smtp.secure,
        };
        if (smtp.authentication && smtp.username && smtp.password) {
          // If authentication details are provided, add them to the transport
          // configuration.
          opts.auth = {
            type: "login",
            user: smtp.username,
            pass: smtp.password,
          };
        }

        // Create the transport based on the smtp uri.
        transport = createTransport(opts);
      } catch (e) {
        throw new InternalError(e, "could not create email transport");
      }

      // Set the transport back into the cache.
      cache.set(tenantID, transport);

      log.debug("transport was not cached");
    } else {
      log.debug("transport was cached");
    }

    log.debug("starting to send the email");

    const startMessageSendTime = now();

    try {
      // Send the mail message.
      await transport.sendMail(message);
    } catch (e) {
      throw new InternalError(e, "could not send email");
    }

    // Compute the end time.
    const messageSendResponseTime = Math.round(now() - startMessageSendTime);
    log.debug({ responseTime: messageSendResponseTime }, "sent the email");
  };
};
