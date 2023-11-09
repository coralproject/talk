import { Db } from "mongodb";
import { v4 as uuid } from "uuid";

import { CreateSiteInput, CreateTenantInput, CreateUserInput, GQLUSER_ROLE } from "./createTenant/models";
import { Prompt } from "./prompt";
import { parseBool } from "./args";

const {
  createEmptyRelatedCommentCounts,
} = require("coral-server/core/server/models/comment");
const {
  getDefaultBadgeConfiguration,
  getDefaultReactionConfiguration,
} = require("coral-server/core/server/models/tenant");
const {
  combineTenantDefaultsAndInput,
} = require("coral-server/core/server/models/tenant/tenant");
const {
  conformURLToOrigins,
} = require("coral-server/core/server/services/sites");
const {
  findOrCreateUserInput,
} = require("coral-server/core/server/models/user/user");

export const create = async (db: Db) => {
  const tenants = db.collection("tenants");
  const sites = db.collection("sites");
  const users = db.collection("users");

  const prompt = new Prompt();

  const createTenantInput: CreateTenantInput = {
    domain: "",
    organization: {
      name: "",
      contactEmail: "",
      url: "",
    },
    locale: "en-US",
  };

  createTenantInput.domain = await prompt.ask(
    "what domain would you like to use for the tenant?"
  );

  createTenantInput.organization.name = await prompt.ask(
    "what is the name of the organization for this tenant?"
  );

  createTenantInput.organization.contactEmail = await prompt.ask(
    "what is the contact email for the organization?"
  );

  createTenantInput.organization.url = await prompt.ask(
    "what is the url for the organization?"
  );

  const now = new Date();

  const createSiteInput: CreateSiteInput = {
    name: "",
    allowedOrigins: [],
  };

  createSiteInput.name = await prompt.ask(
    "what is the name of the site for the organization?"
  );

  const rawOrigins = await prompt.ask(
    "please enter the allowed origins for the site (comma separated):"
  );
  createSiteInput.allowedOrigins = rawOrigins.split(",").map((o) => o.trim());

  const userInput: CreateUserInput = {
    id: uuid(),
    username: "",
    email: "",
    emailVerified: true,
    role: GQLUSER_ROLE.ADMIN,
    profile: {
      type: "local",
      id: "",
      password: "",
      passwordID: "",
    }
  }

  userInput.username = await prompt.ask(
    "what is the username for the admin user?"
  );

  userInput.email = await prompt.ask(
    "what is the email for the admin user?"
  );
  userInput.profile.id = userInput.email.toLowerCase();

  const password = await prompt.ask(
    "what is the password for the admin user?"
  );
  userInput.profile.password = password;
  userInput.profile.passwordID = uuid();

  const newTenant = createTenantModel(createTenantInput, now);
  const newSite = createSiteModel(newTenant, createSiteInput, now);
  const newUser = await findOrCreateUserInput(newTenant.id, userInput, now);

  console.log("-- Tenant to be created:")
  console.log(newTenant);
  console.log("\n");

  console.log("-- Site to be created:")
  console.log(newSite);
  console.log("\n");

  console.log("-- Admin user to be created:")
  console.log(newUser);
  console.log("\n");

  const proceedResponse = await prompt.ask(
    "Are the above details correct? Shall we proceed with tenant creation?"
  );

  if (parseBool(proceedResponse)) {
    await tenants.insertOne(newTenant);
    await sites.insertOne(newSite);
    await users.insertOne(newUser);
  }
};

const createTenantModel = (input: CreateTenantInput, now: Date) => {
  const reaction = getDefaultReactionConfiguration();
  const badge = getDefaultBadgeConfiguration();
  const model = combineTenantDefaultsAndInput(input, reaction, badge);

  return model;
};

const createSiteModel = (tenant: any, input: CreateSiteInput, now: Date) => {
  const createInput = {
    ...input,
    ...conformURLToOrigins(input.allowedOrigins),
    tenantID: tenant.id,
  };

  const site = {
    ...createInput,
    id: uuid(),
    commentCounts: createEmptyRelatedCommentCounts(),
    createdAt: now,
  };

  return site;
};
