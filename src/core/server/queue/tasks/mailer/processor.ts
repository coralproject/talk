import { Message, SMTPClient, SMTPConnectionOptions } from "emailjs";
import { isNil } from "lodash";
import { singleton } from "tsyringe";

import { WrappedInternalError } from "coral-server/errors";
import { createTimer } from "coral-server/helpers";
import { Logger } from "coral-server/logger";
import {
  Processor,
  ProcessorHandler,
} from "coral-server/queue/tasks/processor";
import {
  TenantCache,
  TenantCacheAdapter,
} from "coral-server/services/tenant/cache";

import { GQLSMTP } from "coral-server/graph/schema/__generated__/types";

import { MessageTranslator } from "./translator";

export const JOB_NAME = "mailer";

export interface MailerData {
  templateName: string;
  message: {
    to: string;
    html: string;
  };
  tenantID: string;
}

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

@singleton()
export class MailerQueueProcessor implements Processor<MailerData> {
  constructor(
    private readonly translator: MessageTranslator,
    private readonly smtpCache: TenantCacheAdapter<SMTPClient>,
    private readonly tenantCache: TenantCache
  ) {}

  public process: ProcessorHandler<MailerData> = async (logger, job) => {
    // Pull the data out of the validated model.
    const { tenantID } = job.data;

    // Get the referenced tenant so we know who to send it from.
    const tenant = await this.tenantCache.retrieveByID(tenantID);
    if (!tenant) {
      logger.error("referenced tenant was not found");
      return;
    }

    const { enabled, smtp, fromEmail, fromName } = tenant.email;
    if (!enabled) {
      logger.error("not sending email, it was disabled");
      return;
    }

    // Check that we have enough to generate the smtp credentials.
    if (isNil(smtp.secure) || isNil(smtp.host) || isNil(smtp.port)) {
      logger.error("email enabled, but Configuration is incomplete");
      return;
    }

    if (!fromEmail) {
      logger.error(
        "email was enabled but the fromAddress Configuration was missing"
      );
      return;
    }

    // Construct the fromAddress.
    const fromAddress = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

    const templateGenerationTimer = createTimer();

    // Get the message to send.
    let message: Message;
    try {
      message = await this.translator.translate(
        logger,
        tenant,
        job.data.templateName,
        fromAddress,
        job.data
      );
    } catch (e) {
      throw new WrappedInternalError(e, "could not translate the message");
    }

    logger.trace(
      { responseTime: templateGenerationTimer() },
      "finished mail translation"
    );

    const client = this.getClient(logger, tenantID, smtp);

    logger.debug("starting to send the email");

    const messageSendTimer = createTimer();

    try {
      // Send the mail message.
      await send(client, message);
    } catch (e) {
      throw new WrappedInternalError(e, "could not send email");
    }

    logger.debug({ responseTime: messageSendTimer() }, "sent the email");
  };

  private getClient(logger: Logger, tenantID: string, smtp: GQLSMTP) {
    let client = this.smtpCache.get(tenantID);
    if (!client) {
      try {
        // Create the new transport options.
        const opts: Partial<SMTPConnectionOptions> = {
          host: smtp.host,
          port: smtp.port,
          tls: smtp.secure,
        };
        if (smtp.authentication && smtp.username && smtp.password) {
          // If authentication details are provided, add them to the transport
          // Configuration.
          opts.user = smtp.username;
          opts.password = smtp.password;
          opts.authentication = ["LOGIN"];
        }

        // Create the transport based on the smtp uri.
        client = new SMTPClient(opts);
      } catch (e) {
        throw new WrappedInternalError(e, "could not create email transport");
      }

      // Set the transport back into the cache.
      this.smtpCache.set(tenantID, client);

      logger.debug("client was not cached");
    } else {
      logger.debug("client was cached");
    }

    return client;
  }
}
