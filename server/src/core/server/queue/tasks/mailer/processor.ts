import { FluentBundle } from "@fluent/bundle/compat";
import { DOMLocalization } from "@fluent/dom";
import createDOMPurify from "dompurify";
import {
  Message,
  MessageAttachment,
  MessageHeaders,
  SMTPClient,
  SMTPConnectionOptions,
} from "emailjs";
import htmlToText from "html-to-text";
import Joi from "joi";
import { JSDOM } from "jsdom";
import { juiceResources } from "juice";
import { camelCase, isNil } from "lodash";
import timeoutPromiseAfter from "p-timeout";

import { LanguageCode } from "coral-common/helpers";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { WrappedInternalError } from "coral-server/errors";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { hasFeatureFlag, Tenant } from "coral-server/models/tenant";
import { isLastAttempt, JobProcessor } from "coral-server/queue/Task";
import { I18n, translate } from "coral-server/services/i18n";
import {
  TenantCache,
  TenantCacheAdapter,
} from "coral-server/services/tenant/cache";

import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

export const JOB_NAME = "mailer";

interface TemplateMeta {
  name: string;
  context: object;
}

export interface MailProcessorOptions {
  config: Config;
  mongo: MongoContext;
  tenantCache: TenantCache;
  i18n: I18n;
}

export interface MailerData {
  templateName: string;
  templateContext: object;
  message: {
    to: string;
    html: string;
  };
  tenantID: string;
}

const MailerDataSchema = Joi.object().keys({
  templateName: Joi.string(),
  templateContext: Joi.object().unknown(true),
  message: Joi.object().keys({
    to: Joi.string(),
    html: Joi.string(),
  }),
  tenantID: Joi.string(),
});

function send(client: SMTPClient, message: Message): Promise<Message> {
  return new Promise((resolve, reject) => {
    client.send(message, (err, msg) => {
      if (err) {
        return reject(err);
      }

      return resolve(msg);
    });
  });
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

        return resolve(html);
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
    // TODO: don't cast to any.
    await loc.translateFragment(dom.window.document as any);

    // Grab the rendered HTML from the dom, and juice them.
    if (!dom.window.document.documentElement) {
      throw new Error("dom did not have a document element");
    }

    // Configure the purification.
    const purify = createDOMPurify(dom.window as any);

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

    // Wrap the html in an email attachment as an alternative representation of
    // the email message. This is casted "as MessageAttachment" following the
    // test example here:
    //
    // https://github.com/eleith/emailjs/blob/0781d02cbf7de0d55b417d00ae7f5ab1283bf527/test/message.ts#L166-L169
    //
    // TODO: (wyattjoh) tracking issue here https://github.com/eleith/emailjs/issues/254
    const attachment = {
      data: html,
      alternative: true,
    } as MessageAttachment;

    // Get the translated subject.
    const subject = translate(
      bundle,
      templateName,
      `email-subject-${camelCase(templateName)}`,
      { organizationName: tenant.organization.name }
    );

    // Generate the text content of the message from the HTML.
    const text = htmlToText.fromString(html);

    const headers: Partial<MessageHeaders> = {
      from: fromAddress,
      to: data.message.to,
      text,
      subject,
      attachment,
    };

    // If the EMAIL_META feature flag is enabled, add the `X-Coral-Template`
    // header.
    if (hasFeatureFlag(tenant, GQLFEATURE_FLAG.EMAIL_META)) {
      const template: TemplateMeta = {
        name: data.templateName,
        context: data.templateContext,
      };

      logger.debug({ template }, "adding template context");

      headers["X-Coral-Template"] = JSON.stringify(template);
    }

    // Prepare the message payload.
    return new Message(headers);
  };
}

export const createJobProcessor = (
  options: MailProcessorOptions
): JobProcessor<MailerData> => {
  const { tenantCache, i18n, config } = options;

  // The maximum number of emails that can be sent on a given transport.
  const smtpTransportSendMax = config.get("smtp_transport_send_max");
  const transportTimeout = config.get("smtp_transport_timeout");

  // Store the number of emails sent so we can reset the transport if it errors
  // or it exceeds the maximum send amount.
  let sentEmailsCounter = 0;

  // Create the cache adapter that will handle invalidating the email transport
  // when the tenant experiences a change.
  const cache = new TenantCacheAdapter<SMTPClient>(tenantCache, async () => {
    // When the transport is invalidated because of updates to the Tenant, then
    // reset the email counter.
    sentEmailsCounter = 0;
  });

  // Create the message translator function.
  const translateMessage = createMessageTranslator(i18n);

  return async (job) => {
    const { value: data, error: err } = MailerDataSchema.validate(job.data, {
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
    const { tenantID } = data;

    const log = logger.child(
      {
        jobID: job.id,
        jobName: JOB_NAME,
        tenantID,
        sentEmails: sentEmailsCounter,
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

    const templateGenerationTimer = createTimer();

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
      throw new WrappedInternalError(e, "could not translate the message");
    }

    log.trace(
      { responseTime: templateGenerationTimer() },
      "finished mail translation"
    );

    let transport = cache.get(tenantID) || null;

    // If the transport was cached, and the number of sent emails was greater
    // than the configured maximum, reset it.
    if (transport && sentEmailsCounter > smtpTransportSendMax) {
      // Clear the transport from the cache now that we've determined that the
      // number of sent emails has gone above the limit.
      cache.delete(tenantID);

      // Unset the transport so the next block re-creates it,
      transport = null;

      log.info("resetting smtp transport, maximum send reached");
    }

    if (!transport) {
      // Reset the sent email counter, we're recreating the transport!
      sentEmailsCounter = 0;

      try {
        // Create the new transport options.
        const opts: Partial<SMTPConnectionOptions> = {
          host: smtp.host,
          port: smtp.port,
          tls: smtp.secure,
          timeout: transportTimeout,
        };
        if (smtp.authentication && smtp.username && smtp.password) {
          // If authentication details are provided, add them to the transport
          // configuration.
          opts.user = smtp.username;
          opts.password = smtp.password;
          opts.authentication = ["LOGIN"];
        }

        // Create the transport based on the smtp uri.
        transport = new SMTPClient(opts);
      } catch (e) {
        throw new WrappedInternalError(e, "could not create email transport");
      }

      // Set the transport back into the cache.
      cache.set(tenantID, transport);

      log.debug("transport was not cached");
    } else {
      log.debug("transport was cached");
    }

    log.debug("starting to send the email");

    const messageSendTimer = createTimer();

    try {
      // Send the mail message, and time the send out if it takes longer than
      // the transport timeout to finish.
      await timeoutPromiseAfter(send(transport, message), transportTimeout);
    } catch (e) {
      // As the email has failed to send, there may be an issue with the
      // transport, so clear the stored transport.
      cache.delete(tenantID);

      // Reset the sent email counter, we've reset the transport!
      sentEmailsCounter = 0;
      log.warn({ err: e }, "reset smtp transport due to a send error");

      if (isLastAttempt(job)) {
        throw new WrappedInternalError(e, "could not send email, not retrying");
      }

      throw new WrappedInternalError(e, "could not send email, will retry");
    }

    // Increment the sent email counter.
    sentEmailsCounter++;

    log.debug({ responseTime: messageSendTimer() }, "sent the email");
  };
};
