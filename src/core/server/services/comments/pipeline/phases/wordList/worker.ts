import RE2 from "re2";
import { isMainThread, parentPort } from "worker_threads";

import { LanguageCode } from "coral-common/helpers";
import { WordlistMatch } from "coral-server/models/comment";

import createServerWordListRegEx from "../../createServerWordListRegEx";
import {
  InitializationPayload,
  MessageType,
  ProcessPayload,
  WordListCategory,
  WordListMatchResult,
  WordListWorkerMessage,
  WordListWorkerResult,
} from "./message";

interface List {
  tenantID: string;
  category: WordListCategory;
  locale: LanguageCode;
  regex: RE2 | null;
}

const lists = new Map<string, List>();

const computeWordListKey = (tenantID: string, category: WordListCategory) => {
  return `${tenantID}-${category}`;
};

const initialize = (
  id: string,
  { tenantID, category, locale, phrases }: InitializationPayload
): WordListWorkerResult => {
  const key = computeWordListKey(tenantID, category);
  const regex =
    phrases.length > 0 ? createServerWordListRegEx(locale, phrases) : null;

  lists.set(key, { tenantID, category, locale, regex });

  return {
    id,
    tenantID,
    ok: true,
  };
};

const sumPriorLengths = (items: string[], index: number): number => {
  let sum = 0;
  for (let i = 0; i < index; i++) {
    const item = items[i];
    sum += item.length;
  }

  return sum;
};

const process = (
  id: string,
  { tenantID, category, testString }: ProcessPayload
): WordListWorkerResult => {
  const listKey = computeWordListKey(tenantID, category);
  const list = lists.get(listKey);

  if (!list) {
    return {
      id,
      tenantID,
      ok: false,
    };
  }

  if (!list || list.regex === null) {
    return {
      id,
      tenantID,
      ok: true,
      data: {
        isMatched: false,
        matches: [],
      },
    };
  }

  const tokens = testString.split(list.regex);

  const matches: WordlistMatch[] = [];
  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t];
    // found a matched word
    if (t % 4 === 2) {
      const index = sumPriorLengths(tokens, t);
      matches.push({
        value: token,
        index,
        length: token.length,
      });
    }
  }

  const data: WordListMatchResult = {
    isMatched: matches.length > 0,
    matches,
  };

  const result: WordListWorkerResult = {
    id,
    tenantID,
    ok: true,
    data,
  };

  return result;
};

const run = () => {
  if (isMainThread || !parentPort) {
    return;
  }

  parentPort.on("message", (message: WordListWorkerMessage) => {
    if (!message || !parentPort) {
      return;
    }

    const { type, data } = message;

    if (type === MessageType.Initialize) {
      const payload = data as InitializationPayload;
      if (!payload) {
        return;
      }

      const result = initialize(message.id, payload);
      parentPort.postMessage(result);
    } else if (type === MessageType.Process) {
      const payload = data as ProcessPayload;
      if (!payload) {
        return;
      }

      const result = process(message.id, payload);
      parentPort.postMessage(result);
    }
  });
};

run();
