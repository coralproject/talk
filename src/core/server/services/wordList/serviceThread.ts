import { WordlistMatch } from "coral-server/models/comment";
import { isMainThread, parentPort, workerData } from "worker_threads";
import createServerWordListRegex from "../comments/pipeline/createServerWordListRegex";
import { WordlistServiceOptions } from "./wordlistService";

export interface WordlistThreadRequest {
  id: string;
  testString: string;
}

function sumPriorLengths(items: string[], index: number): number {
  let sum = 0;
  for (let i = 0; i < index; i++) {
    const item = items[i];
    sum += item.length;
  }

  return sum;
}

const run = async (options: WordlistServiceOptions) => {
  if (isMainThread) {
    return;
  }
  if (!options) {
    return;
  }
  if (!parentPort) {
    return;
  }

  const regexp = createServerWordListRegex(options.lang, options.phrases);

  parentPort.on("message", (msg: WordlistThreadRequest) => {
    if (!msg) {
      parentPort!.postMessage({
        id: "",
        success: false,
        result: {
          isMatched: false,
          timedOut: false,
          matches: [],
        },
      });
      return;
    }

    try {
      const tokens = msg.testString.split(regexp);

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

      const result = {
        isMatched: matches.length > 0,
        timedOut: false,
        matches,
      };

      parentPort!.postMessage({
        id: msg.id,
        success: true,
        result,
      });
    } catch (err) {
      parentPort!.postMessage({
        id: msg.id,
        success: false,
        result: {
          isMatched: false,
          timedOut: false,
          matches: [],
        },
      });
    }
  });
};

void run(workerData as WordlistServiceOptions);
