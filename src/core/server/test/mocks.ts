import { MongoContext } from "coral-server/data/context";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { RejectorQueue } from "coral-server/queue/tasks/rejector";
import { TenantCache } from "coral-server/services/tenant/cache";
import { Redis } from "ioredis";

const createMockCollection = () => ({
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
});

export const createMockMongoContex = () => {
  const users = createMockCollection();

  return {
    ctx: {
      users: () => users,
    } as unknown as MongoContext,
    users,
  };
};

export const createMockRedis = () => ({} as Redis);

export const createMockTenantCache = (): TenantCache =>
  ({
    // add methods as nessecary
  } as unknown as TenantCache);

export const createMockMailer = () =>
  ({
    add: jest.fn().mockResolvedValue({}),
  } as unknown as MailerQueue);

export const createMockRejector = () =>
  ({
    add: jest.fn().mockResolvedValue({}),
  } as unknown as RejectorQueue);
