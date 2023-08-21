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

interface PromiseCallbacks<R> {
  resolve: (result: R) => void;
  reject: (err: Error) => void;
}

export class WordListService {
  private worker: Worker;

  private onMessageDelegate: (event: MessageEvent) => void;
  private readonly callbacks: Map<
    string,
    PromiseCallbacks<WordListWorkerResult>
  > = new Map();
  private logger: Logger;
  private sanitizer: Sanitize;

  constructor(logger: Logger) {
    this.logger = logger;

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

  private onMessage(result: WordListWorkerResult) {
    if (!result) {
      return;
    }

    // Get the callbacks for this result.
    const callbacks = this.callbacks.get(result.id);
    if (!callbacks) {
      throw new Error(`Invalid result id: ${result.id}`);
    }

    // Delete the callbacks for this result.
    this.callbacks.delete(result.id);

    // Resolve the promise.
    if (result.ok) {
      callbacks.resolve(result);
    } else {
      callbacks.reject(result.err!);
    }
  }

  private send(message: WordListWorkerMessage) {
    // Create a new promise to wait for the worker to finish.
    const promise = new Promise<WordListWorkerResult>((resolve, reject) => {
      this.callbacks.set(message.id, { resolve, reject });
    });

    this.worker.postMessage(message);

    return promise;
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

    const result = await this.send(message);
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

    // Send the message to the worker.
    const result = await this.send(message);
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
