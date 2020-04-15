export default function combineEventHandlers<A, B, C, D>(
  a: A,
  b: B,
  c: C,
  d: D
): A & B & C & D;
export default function combineEventHandlers<A, B, C>(
  a: A,
  b: B,
  c: C
): A & B & C;
export default function combineEventHandlers<A, B>(a: A, b: B): A & B;

/**
 * combineEventHandlers expects prop objects with React
 * like onEvent handlers e.g. onClick, onKeydown and combine them
 * by calling them one after another.
 */
export default function combineEventHandlers(...propObjects: any[]): any {
  const result: any = {};
  propObjects.forEach((o) => {
    Object.keys(o).forEach((k) => {
      if (k in result) {
        const prev = result[k];
        result[k] = (...args: any[]) => {
          prev(...args);
          o[k](...args);
        };
      } else {
        result[k] = o[k];
      }
    });
  });
  return result;
}
