import { v4 as uuid } from "uuid";
import { Worker } from "worker_threads";

import { LanguageCode } from "coral-common/helpers";
import { MatchResult } from "coral-server/helpers/createTesterWithTimeout";
import { Logger } from "coral-server/logger";

import { WordlistThreadRequest } from "./serviceThread";

interface WordlistRequest {
  id: string;
  resolve: (
    value: WordlistThreadResult | PromiseLike<WordlistThreadResult>
  ) => void;
  reject: (reason?: any) => void;
}

export interface WordlistServiceOptions {
  lang: LanguageCode;
  phrases: string[];
}

interface WordlistThreadResult {
  id: string;
  success: boolean;
  result: MatchResult;
}

export default class WordlistService {
  private worker: Worker;
  private script: string;
  private requests: Map<string, WordlistRequest>;
  private logger: Logger;
  private timeout: number;

  private onMessageDelegate: any;
  private onErrorDelegate: any;

  constructor(
    logger: Logger,
    timeout: number,
    options: WordlistServiceOptions
  ) {
    this.logger = logger;
    this.timeout = timeout;
    this.requests = new Map<string, WordlistRequest>();

    this.script = "./dist/core/server/services/wordList/serviceThread.js";
    this.worker = new Worker(this.script, {
      workerData: options,
    });

    this.onMessageDelegate = this.onMessage.bind(this);
    this.onErrorDelegate = this.onError.bind(this);

    this.worker.on("message", this.onMessageDelegate);
    this.worker.on("error", this.onErrorDelegate);
  }

  public test(testString: string) {
    const id = uuid();

    const requests = this.requests;
    const timeout = this.timeout;

    const promise = new Promise<WordlistThreadResult>((resolve, reject) => {
      requests.set(id, {
        id,
        resolve,
        reject,
      });

      setTimeout(() => {
        if (!requests.has(id)) {
          return;
        }

        const timedOutResult: WordlistThreadResult = {
          id,
          success: false,
          result: {
            isMatched: false,
            timedOut: true,
            matches: [],
          },
        };
        resolve(timedOutResult);
        requests.delete(id);
      }, timeout);
    });

    const request: WordlistThreadRequest = {
      id,
      testString,
    };
    this.worker.postMessage(request);

    return promise;
  }

  private onMessage(msg: WordlistThreadResult) {
    if (!msg || !msg.success) {
      return;
    }
    if (!this.requests.has(msg.id)) {
      return;
    }

    const request = this.requests.get(msg.id);
    if (!request) {
      return;
    }

    request.resolve(msg);
    this.requests.delete(msg.id);
  }

  private onError(err: Error) {
    this.logger.error(
      { err },
      "an error occurred evaluating the regular expression"
    );
  }
}
