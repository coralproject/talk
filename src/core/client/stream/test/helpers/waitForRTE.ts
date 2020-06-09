import RTE from "@coralproject/rte";
import {
  act,
  findParentWithType,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import { ReactTestInstance } from "react-test-renderer";

/**
 * waitForRTE returns an promise that resolves to the instance of `RTE`.
 *
 * @param instance The instance to look within
 * @param label The label of the RTE
 * @returns Promise of RTE TestInstance
 */
export default function waitForRTE(instance: ReactTestInstance, label: string) {
  return act(() =>
    waitForElement(
      () =>
        findParentWithType(
          within(instance).getByLabelText(label),
          // We'll use the RTE component here as an exception because the
          // jsdom does not support all of what is needed for rendering the
          // Rich Text Editor.
          RTE
        )!
    )
  );
}
