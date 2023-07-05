import { GQLWordlistMatch } from "coral-framework/schema";

interface Split {
  start: number;
  end: number;
  replace?: boolean;
}

// markPhrasesHTML looks for `suspect` and `banned` words inside `text` given
// the settings applied for the locale and highlights them by returning an HTML
// string.
export default function markPhrasesHTML(
  text: string,
  words: GQLWordlistMatch[]
) {
  const splits: Split[] = [];

  // nothing to mark, bail out early
  if (words.length === 0) {
    return text;
  }
  // base case of only one word, just declare the split groups
  if (words.length === 1) {
    const word = words[0];

    // before word
    splits.push({
      start: 0,
      end: word.index,
    });
    // marked word
    splits.push({
      start: word.index,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      end: word.index + word.length,
      replace: true,
    });
    // after word
    splits.push({
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      start: word.index + word.length,
      end: text.length,
    });
  }
  // many words, need to walk through and calculate all the splits
  else {
    const firstWord = words[0];
    // before first word
    splits.push({
      start: 0,
      end: firstWord.index,
    });
    // first marked word
    splits.push({
      start: firstWord.index,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      end: firstWord.index + firstWord.length,
      replace: true,
    });

    for (let w = 1; w < words.length; w++) {
      const prevWord = words[w - 1];
      const word = words[w];

      // before current marked word
      splits.push({
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        start: prevWord.index + prevWord.length,
        end: word.index,
      });
      // current marked word
      splits.push({
        start: word.index,
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        end: word.index + word.length,
        replace: true,
      });
    }

    // content after last marked word
    const lastWord = words[words.length - 1];
    splits.push({
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      start: lastWord.index + lastWord.length,
      end: text.length,
    });
  }

  const parts: string[] = [];
  for (const split of splits) {
    const part = text.substring(split.start, split.end);

    if (split.replace) {
      parts.push(`<mark>${part}</mark>`);
    } else {
      parts.push(part);
    }
  }

  return parts.join("");
}
