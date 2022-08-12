import { MongoContext } from "coral-server/data/context";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { RejectorQueue } from "coral-server/queue/tasks/rejector";

const createMockCollection = () => ({
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
});

export const createMockMongoContex = () => {
  const users = createMockCollection();

  return {
    ctx: ({
      users: () => users,
    } as unknown) as MongoContext,
    users,
  };
};

export const createMockMailer = () =>
  (({
    add: jest.fn().mockResolvedValue({}),
  } as unknown) as MailerQueue);

export const createMockRejector = () =>
  (({
    add: jest.fn().mockResolvedValue({}),
  } as unknown) as RejectorQueue);
