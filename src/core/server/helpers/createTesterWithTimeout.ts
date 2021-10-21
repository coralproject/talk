import { Worker } from "worker_threads";

import logger from "coral-server/logger";
import { WordlistMatch } from "coral-server/models/comment";

export interface MatchResult {
  isMatched: boolean | null;
  timedOut: boolean;
  matches: WordlistMatch[];
}

export type TestWithTimeout = (testString: string) => Promise<MatchResult>;

export enum ThreadedMessageType {
  Unknown = 0,
  Message,
  Done,
  Error,
}

export interface ThreadedMessage {
  type: ThreadedMessageType;
  data?: any;
  error?: Error;
}

const startThread = async (
  script: string,
  timeout: number,
  data?: any
): Promise<ThreadedMessage> => {
  const worker = new Worker(script, { workerData: data });

  return new Promise<ThreadedMessage>((resolve, reject) => {
    worker.on("message", (msg) => {
      const message = msg as ThreadedMessage;
      if (message && message.type === ThreadedMessageType.Done) {
        resolve(message);
      }
    });
    worker.on("error", (err) => {
      reject({
        type: ThreadedMessageType.Error,
        error: err,
      });
    });
    setTimeout(() => {
      void worker.terminate();
      reject();
    }, timeout);
  });
};

/**
 * createTesterWithTimeout will create a tester that after the timeout, will
 * return null instead of a boolean.
 *
 * @param regexp the regular expression to wrap
 * @param timeout the timeout to use
 */
export default function createTesterWithTimeout(
  pattern: string,
  timeout: number
): TestWithTimeout {
  return async (testString: string) => {
    const threadArgs = {
      pattern,
      testString,
    };

    const threadedScript =
      "./dist/core/server/services/wordList/threadedTester.js";
    const result = await startThread(threadedScript, timeout, threadArgs);
    if (result.type === ThreadedMessageType.Error) {
      logger.error(
        { err: result.error },
        "an error occurred evaluating the regular expression"
      );
    }

    const data = result.data as MatchResult;
    return data;
  };
}
