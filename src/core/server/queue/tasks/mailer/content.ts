import { minify } from "html-minifier";
import { juiceResources } from "juice";
import { camelCase } from "lodash";
import nunjucks, { Environment, ILoader } from "nunjucks";
import path from "path";

import { Config } from "talk-server/config";
import TenantCache from "talk-server/services/tenant/cache";
import { TenantCacheAdapter } from "talk-server/services/tenant/cache/adapter";

import { Tenant } from "talk-server/models/tenant";
import { Template } from "./templates";

// templateDirectory is the directory containing the email templates.
const templateDirectory = path.join(__dirname, "templates");

export interface MailerContentOptions {
  config: Config;
  tenantCache: TenantCache;
}

/**
 * juiceHTML will juice the HTML to inline the CSS.
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

/**
 * render will render the nunjucks template using the provided environment.
 *
 * @param env the nunjucks rendering environment
 * @param template the template to render
 */
function render(env: Environment, { name, context }: Template) {
  return new Promise<string>((resolve, reject) =>
    env.render(
      name + ".html",
      { context, name: camelCase(name) },
      (err, html) => {
        if (err) {
          return reject(err);
        }

        return resolve(html);
      }
    )
  );
}

export default class MailerContent {
  private cache: TenantCacheAdapter<nunjucks.Environment>;
  private config: Config;
  private loaders: ILoader[];

  constructor({ config, tenantCache }: MailerContentOptions) {
    this.config = config;

    // Configure the environment cache.
    this.cache = new TenantCacheAdapter(tenantCache);

    // Configure the loaders for the templates that apply to all clients.
    this.loaders = [
      // Load the templates from the filesystem.
      new nunjucks.FileSystemLoader(templateDirectory, {
        // When we aren't in production mode, reload the templates.
        watch: this.config.get("env") !== "production",
      }),
    ];
  }

  private getEnvironment(tenant: Tenant): nunjucks.Environment {
    // Get the nunjucks environment to use for generating the email HTML.
    let env = this.cache.get(tenant.id);
    if (!env) {
      // TODO: (wyattjoh) add the custom loader per tenant here to support customizing templates.
      // Configure the nunjucks environment.
      env = new nunjucks.Environment(this.loaders);

      // Set the environment in the cache.
      this.cache.set(tenant.id, env);
    }

    return env;
  }

  /**
   * generateHTML will generate the HTML for a template and optionally cache
   * the compiled template based on the configured environment.
   *
   * @param options configuration for generating HTML based on the email
   *                template.
   */
  public async generateHTML(
    tenant: Tenant,
    template: Template
  ): Promise<string> {
    // Get the environment to render with.
    const env = this.getEnvironment(tenant);

    // Render the nunjucks template.
    const html = await render(env, template);

    // Return the juiced HTML.
    return juiceHTML(html);
  }
}
