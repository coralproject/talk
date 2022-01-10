import { MongoContext } from "coral-server/data/context";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { RejectorQueue } from "coral-server/queue/tasks/rejector";

/* eslint-disable */
export const createMockMongoContex = () =>
  ({
    /* feel free to add mock methods as needed */
  }) as unknown as MongoContext;

export const createMockMailer = () =>
  ({
    add: jest.fn().mockResolvedValue({})
  }) as unknown as MailerQueue;

export const createMockRejector = () =>
  ({
    add: jest.fn().mockResolvedValue({})
  }) as unknown as RejectorQueue;
