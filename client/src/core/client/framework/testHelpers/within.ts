import { axe } from "jest-axe";
import { ReactTestInstance } from "react-test-renderer";

import { getByID, queryByID } from "./byID";
import {
  getAllByLabelText,
  getByLabelText,
  queryAllByLabelText,
  queryByLabelText,
} from "./byLabelText";
import {
  getAllByTestID,
  getByTestID,
  queryAllByTestID,
  queryByTestID,
} from "./byTestID";
import { getAllByText, getByText, queryAllByText, queryByText } from "./byText";
import {
  getAllByTitle,
  getByTitle,
  queryAllByTitle,
  queryByTitle,
} from "./byTitle";
import {
  getAllByType,
  getByType,
  getParentByType,
  queryAllByType,
  queryByType,
  queryParentByType,
} from "./byType";
import toHTML from "./toHTML";
import toJSON from "./toJSON";

type Func0<R> = () => R;
type Func1<A, R> = (a?: A) => R;
type Func2<A, B, R> = (a: A, b?: B) => R;
type Func3<A, B, C, R> = (a: A, b: B, c?: C) => R;

type RemoveFirstArgument<T, R> = T extends [any, any, any, any?]
  ? Func3<T[1], T[2], T[3], R>
  : T extends [any, any, any?]
  ? Func2<T[1], T[2], R>
  : T extends [any, any?]
  ? Func1<T[1], R>
  : T extends [any]
  ? Func0<R>
  : unknown;

function applyContainer<T extends [ReactTestInstance, ...any[]], R>(
  container: ReactTestInstance,
  fn: (...args: T) => R
): RemoveFirstArgument<T, R> {
  return ((...args: any[]) => fn(...([container, ...args] as any))) as any;
}

export default function within(container: ReactTestInstance) {
  return {
    getByTestID: applyContainer(container, getByTestID),
    getAllByTestID: applyContainer(container, getAllByTestID),
    queryByTestID: applyContainer(container, queryByTestID),
    queryAllByTestID: applyContainer(container, queryAllByTestID),
    getByID: applyContainer(container, getByID),
    queryByID: applyContainer(container, queryByID),
    getByText: applyContainer(container, getByText),
    getAllByText: applyContainer(container, getAllByText),
    queryByText: applyContainer(container, queryByText),
    queryAllByText: applyContainer(container, queryAllByText),
    getByLabelText: applyContainer(container, getByLabelText),
    getAllByLabelText: applyContainer(container, getAllByLabelText),
    queryByLabelText: applyContainer(container, queryByLabelText),
    queryAllByLabelText: applyContainer(container, queryAllByLabelText),
    getByType: applyContainer(container, getByType),
    getParentByType: applyContainer(container, getParentByType),
    getAllByType: applyContainer(container, getAllByType),
    queryByType: applyContainer(container, queryByType),
    queryParentByType: applyContainer(container, queryParentByType),
    queryAllByType: applyContainer(container, queryAllByType),
    getByTitle: applyContainer(container, getByTitle),
    getAllByTitle: applyContainer(container, getAllByTitle),
    queryByTitle: applyContainer(container, queryByTitle),
    queryAllByTitle: applyContainer(container, queryAllByTitle),
    toJSON: applyContainer(container, toJSON),
    toHTML: applyContainer(container, toHTML),
    /**
     * Check for some accessibility violations
     *
     * Example use:
     * `expect(await within(container).axe()).toHaveNoViolations();`
     */
    axe: () =>
      axe(toHTML(container), {
        rules: {
          region: {
            // Only check for landmarks if we are checking at the root level.
            enabled: container.parent === null,
          },
        },
      }),
    /** Output the html representation of the container */
    // eslint-disable-next-line no-console
    debug: () => console.log(toHTML(container, { pretty: true })),
  };
}
