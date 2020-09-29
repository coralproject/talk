import { FluentBundle } from "@fluent/bundle/compat";
import { DOMLocalization } from "@fluent/dom/compat";
import createDOMPurify from "dompurify";
import { Message, MessageAttachment } from "emailjs";
import { JSDOM } from "jsdom";
import { juiceResources } from "juice";
import { camelCase } from "lodash";
import { singleton } from "tsyringe";

import { Logger } from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";
import { I18nService, translate } from "coral-server/services/i18n";

import { MailerData } from "./processor";

function generateBundleIterator(bundle: FluentBundle) {
  return function* generate(resourceIDs: string[]) {
    yield bundle;
  };
}

/**
 * juiceHTML will juice the HTML to inline the CSS and minify it.
 *
 * @param input html string to juice
 */
function juiceHTML(input: string) {
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

@singleton()
export class MessageTranslator {
  constructor(private readonly i18n: I18nService) {}

  public async translate(
    logger: Logger,
    tenant: Tenant,
    templateName: string,
    fromAddress: string,
    data: MailerData
  ): Promise<Message> {
    // Setup the localization bundles.
    const bundle = this.i18n.getBundle(tenant.locale);
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

    // configure the purification.
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

    // Prepare the message payload.
    return new Message({
      from: fromAddress,
      to: data.message.to,
      text,
      subject,
      attachment,
    });
  }
}
