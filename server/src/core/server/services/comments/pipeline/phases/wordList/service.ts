import { JSDOM } from "jsdom";
import { v4 as uuid } from "uuid";
import { Worker } from "worker_threads";

import { LanguageCode } from "coral-common/helpers";
import {
  ALL_FEATURES,
  createSanitize,
  Sanitize,
  WORDLIST_FORBID_TAGS,
} from "coral-common/helpers/sanitize";
import { Logger } from "coral-server/logger";

import {
  InitializationPayload,
  MessageType,
  ProcessPayload,
  WordListCategory,
  WordListMatchResult,
  WordListWorkerMessage,
  WordListWorkerResult,
} from "./message";

const WORKER_SCRIPT =
  "./dist/core/server/services/comments/pipeline/phases/wordList/worker.js";

export class WordListService {
  private worker: Worker;

  private onMessageDelegate: (event: MessageEvent) => void;
  private results: Map<string, WordListWorkerResult>;
  private logger: Logger;
  private sanitizer: Sanitize;

  constructor(logger: Logger, numWorkers = 3) {
    this.logger = logger;

    this.results = new Map<string, WordListWorkerResult>();
    this.onMessageDelegate = this.onMessage.bind(this);

    this.worker = new Worker(WORKER_SCRIPT);
    this.worker.on("message", this.onMessageDelegate);

    this.sanitizer = createSanitize(new JSDOM("", {}).window as any, {
      // We need normalized text nodes to mark nodes for suspect/banned words.
      normalize: true,
      // Allow all RTE features to be displayed.
      features: ALL_FEATURES,
      config: {
        FORBID_TAGS: WORDLIST_FORBID_TAGS,
      },
    });
  }

  private sleep(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  private onMessage(result: WordListWorkerResult) {
    if (!result) {
      return;
    }

    this.results.set(result.id, result);
  }

  public async initialize(
    tenantID: string,
    locale: LanguageCode,
    category: WordListCategory,
    phrases: string[]
  ) {
    const data: InitializationPayload = {
      tenantID,
      locale,
      category,
      phrases,
    };

    const message: WordListWorkerMessage = {
      id: uuid(),
      type: MessageType.Initialize,
      data,
    };

    const builder = async () => {
      let hasResult = this.results.has(message.id);
      while (!hasResult) {
        await this.sleep(1);
        hasResult = this.results.has(message.id);
      }

      const result = this.results.get(message.id);
      if (!result) {
        this.results.delete(message.id);
        return {
          id: message.id,
          tenantID,
          ok: false,
          err: new Error("result was undefined"),
        };
      }

      this.results.delete(message.id);
      return result;
    };

    this.worker.postMessage(message);
    const result = await builder();

    if (!result.ok || result.err) {
      this.logger.error(
        { tenantID: result.tenantID, id: result.id },
        "unable to initialize"
      );

      return false;
    }

    return true;
  }

  public async process(
    tenantID: string,
    category: WordListCategory,
    testString: string
  ): Promise<WordListMatchResult> {
    const sanitizedTestString = this.sanitizer(testString).innerHTML;

    const data: ProcessPayload = {
      tenantID,
      category,
      testString: sanitizedTestString,
    };

    const message: WordListWorkerMessage = {
      id: uuid(),
      type: MessageType.Process,
      data,
    };

    this.worker.postMessage(message);

    const builder = async () => {
      let hasResult = this.results.has(message.id);
      while (!hasResult) {
        await this.sleep(1);
        hasResult = this.results.has(message.id);
      }

      const result = this.results.get(message.id);
      if (!result) {
        this.results.delete(message.id);
        return {
          id: message.id,
          tenantID,
          ok: false,
          err: new Error("result was undefined"),
        };
      }

      this.results.delete(message.id);
      return result;
    };

    const result = await builder();

    if (!result.ok || result.err) {
      return {
        isMatched: false,
        matches: [],
        timedOut: true,
      };
    }

    const resultData = result.data as WordListMatchResult;
    if (!resultData) {
      return {
        isMatched: false,
        matches: [],
        timedOut: true,
      };
    }

    return resultData;
  }
}
