import nunjucks from "nunjucks";
import path from "path";

import { Config } from "talk-server/config";

/**
 * templateDirectory is the directory containing the email templates.
 */
const templateDirectory = path.join(__dirname, "templates");

export interface GenerateHTMLOptions {
  /**
   * name is the name of the template to render.
   */
  name: string;
  context: any;
}

export default class MailerContent {
  private env: nunjucks.Environment;

  constructor(config: Config) {
    // Configure the nunjucks environment.
    this.env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(templateDirectory),
      {
        // When we aren't in production mode, reload the templates.
        watch: config.get("env") !== "production",
      }
    );
  }

  /**
   * generateHTML will generate the HTML for a template and optionally cache
   * the compiled template based on the configured environment.
   *
   * @param options configuration for generating HTML based on the email
   *                template.
   */
  public generateHTML(options: GenerateHTMLOptions): string {
    return this.env.render(options.name + ".html", options.context);
  }
}
